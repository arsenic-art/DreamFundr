import type { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../prisma.js";
import razorpay from "../utils/razorpay.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, fundraiserId } = req.body;
    const userId = req.userId!;

    if (typeof amount !== "number" || amount <= 0 || amount > 100000) {
      return res.status(400).json({
        message: "Invalid amount (₹1 - ₹1,00,000)",
      });
    }

    if (!fundraiserId) {
      return res.status(400).json({ message: "Fundraiser ID required" });
    }

    const fundraiser = await prisma.fundraiser.findUnique({
      where: { id: fundraiserId },
    });

    if (!fundraiser || !fundraiser.isActive) {
      return res.status(404).json({ message: "Fundraiser not available" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `fn_${fundraiserId.slice(0, 12)}`,
      notes: { userId, fundraiserId },
    });

    res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const order = await razorpay.orders.fetch(razorpay_order_id);

    const fundraiserId = order.notes?.fundraiserId;
    const userId = order.notes?.userId;

    if (!fundraiserId || !userId) {
      return res.status(400).json({ message: "Invalid order metadata" });
    }

    const fundraiserIdStr = String(fundraiserId);
    const userIdStr = String(userId);

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const amountPaise = Number(order.amount);
    const amount = Math.round(amountPaise / 100);

    await prisma.$transaction(async (tx) => {
      const exists = await tx.donation.findUnique({
        where: { razorpayPaymentId: razorpay_payment_id },
      });

      if (exists) return;

      await tx.donation.create({
        data: {
          amount,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          fundraiser: { connect: { id: fundraiserIdStr } },
          user: { connect: { id: userIdStr } },
        },
      });

      await tx.fundraiser.update({
        where: { id: fundraiserIdStr },
        data: { raisedAmount: { increment: amount } },
      });
    });

    res.json({ message: "Payment verified successfully", amount });
  } catch (err: any) {
    console.error("Verify payment error:", err);

    if (err.message === "Payment already processed") {
      return res.status(409).json({ message: "Payment already processed" });
    }

    res.status(500).json({ message: "Payment verification failed" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers["x-razorpay-signature"] as string;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body.event;

    switch (event) {
      case "payment.captured":
        await handlePaymentCaptured(req.body.payload.payment.entity);
        break;
      case "payment.failed":
        await handlePaymentFailed(req.body.payload.payment.entity);
        break;
      case "refund.created":
        await handleRefundCreated(req.body.payload.refund.entity);
        break;
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  }
};

async function handlePaymentCaptured(payment: any) {
  const paymentId = payment.id;

  const existing = await prisma.donation.findUnique({
    where: { razorpayPaymentId: paymentId },
  });

  if (existing) return;

  const fundraiserId = payment.notes?.fundraiserId;
  const userId = payment.notes?.userId;

  if (!fundraiserId || !userId) {
    console.error("Missing webhook metadata");
    return;
  }

  const amountPaise = Number(payment.amount);
  const amount = Math.round(amountPaise / 100);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.donation.create({
        data: {
          amount,
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: paymentId,
          razorpaySignature: "webhook",
          fundraiser: { connect: { id: fundraiserId } },
          user: { connect: { id: userId } },
        },
      });

      await tx.fundraiser.update({
        where: { id: fundraiserId },
        data: { raisedAmount: { increment: amount } },
      });
    });

    console.log(`Webhook donation processed: ${paymentId}`);
  } catch (err) {
    console.error("Webhook donation failed:", err);
  }
}

async function handlePaymentFailed(payment: any) {
  console.log(`Payment failed: ${payment.id} - ${payment.error_description}`);
}

async function handleRefundCreated(refund: any) {
  const donation = await prisma.donation.findUnique({
    where: { razorpayPaymentId: refund.payment_id },
  });

  if (!donation) return;

  const refundAmountPaise = Number(refund.amount);
  const refundAmount = Math.round(refundAmountPaise / 100);

  await prisma.fundraiser.update({
    where: { id: donation.fundraiserId },
    data: { raisedAmount: { decrement: refundAmount } },
  });

  console.log(`Refund processed: ${refund.id}`);
}
