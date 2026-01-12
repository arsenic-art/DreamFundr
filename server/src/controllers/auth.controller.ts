import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import { sendVerificationEmail } from "../utils/email.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    });

    await sendVerificationEmail(user.email, token);

    return res.status(201).json({
      message: "Registration successful. Check your email to verify account.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body as { token?: string };

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (record.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: record.id } });
      return res.status(400).json({ message: "Token expired" });
    }

    await prisma.user.update({
      where: { id: record.userId },
      data: { isVerified: true },
    });

    await prisma.verificationToken.delete({ where: { id: record.id } });

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      await prisma.verificationToken.deleteMany({
        where: { userId: user.id },
      });

      const token = crypto.randomBytes(32).toString("hex");

      await prisma.verificationToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        },
      });

      await sendVerificationEmail(user.email, token);

      return res.status(403).json({
        message: "Email not verified. Verification email resent.",
      });
    }

    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
        bio: user.bio ?? null,
        location: user.location ?? null,
        totalDonated: user.totalDonated,
        donationCount: user.donationCount,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
