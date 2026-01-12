import { Router } from "express";

import authRoutes from "./auth.routes.js";
import fundraiserRoutes from "./fundraiser.routes.js";
import commentRoutes from "./comment.routes.js";
import paymentRoutes from "./payment.routes.js";
import donationRoutes from "./donation.routes.js";
import profileRoutes from "./profile.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/fundraisers", fundraiserRoutes);
router.use("/comments", commentRoutes);
router.use("/payments", paymentRoutes);
router.use("/donations", donationRoutes);
router.use("/profile", profileRoutes);
export default router;
