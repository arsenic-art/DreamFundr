import { Router } from "express";
import {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  updateFundraiser,
  closeFundraiser,
  getMyFundraisers,
} from "../controllers/fundraiser.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, createFundraiser);
router.get("/", getAllFundraisers);
router.get("/:id", getFundraiserById);

router.patch("/:id", protect, updateFundraiser);
router.patch("/:id/close", protect, closeFundraiser);
router.get("/me", protect, getMyFundraisers);

export default router;
