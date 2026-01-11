import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import express from "express";

const router = Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

export default router;
