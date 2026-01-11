import { Router } from "express";

import authRoutes from "./auth.routes.js";
import fundraiserRoutes from "./fundraiser.routes.js";
import commentRoutes from "./comment.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

// mount paths here
router.use("/auth", authRoutes);
router.use("/fundraisers", fundraiserRoutes);
router.use("/comments", commentRoutes);
router.use("/payments", paymentRoutes);

export default router;
