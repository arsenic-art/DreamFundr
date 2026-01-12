"use client";

import { useState } from "react";
import { X, Heart } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/errorHandler";

interface DonationModalProps {
  fundraiserId: string;
  fundraiserTitle: string;
  userEmail?: string;
  userName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DonationModal({
  fundraiserId,
  fundraiserTitle,
  userEmail,
  userName,
  onClose,
  onSuccess,
}: DonationModalProps) {
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quickAmounts = [100, 500, 1000, 5000];

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    const amount = parseInt(donationAmount);

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await api.post("/payments/create-order", {
        amount: amount,
        fundraiserId: fundraiserId,
      });

      const orderData = orderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DreamFundr",
        description: `Donation for ${fundraiserTitle}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              fundraiserId: fundraiserId,
              amount: amount,
            });

            // Success
            alert("Thank you for your donation! 🎉");
            onSuccess();
            onClose();
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: userName || "",
          email: userEmail || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-indigo-400" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Make a Donation
          </h2>
          <p className="text-zinc-400 text-sm">
            Support{" "}
            <span className="text-white font-medium">{fundraiserTitle}</span>
          </p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mb-4">
          <label className="text-sm text-zinc-400 mb-2 block">
            Quick Select
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setDonationAmount(amt.toString())}
                disabled={loading}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  donationAmount === amt.toString()
                    ? "bg-indigo-500 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="mb-6">
          <label className="text-sm text-zinc-400 mb-2 block">
            Or Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              ₹
            </span>
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount"
              disabled={loading}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          disabled={loading || !donationAmount}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Donate Now"}
        </button>

        {/* Test Payment Credentials */}
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className=" text-xs font-semibold mb-2 flex items-center gap-1">
            🧪 Test Mode - Use these credentials:
          </p>
          <div className="space-y-1 text-xs ">
            <p>
              <strong>Card:</strong> 2305 3242 5784 8228
            </p>
            <p>
              <strong>Expiry:</strong> Any future date
            </p>
            <p>
              <strong>CVV:</strong> Any 3 digits
            </p>
            <p>
              <strong>Name:</strong> Any name
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500 text-center mt-4">
          Powered by Razorpay • Secure payments
        </p>
      </div>
    </div>
  );
}
