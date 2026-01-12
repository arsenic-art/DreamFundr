import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";   
import {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  updateFundraiser,
  closeFundraiser,
  getMyFundraisers
} from "../controllers/fundraiser.controller.js";

const router = Router();

router.get("/", getAllFundraisers);
router.get("/me", protect, getMyFundraisers); 
router.get("/:id", getFundraiserById);

router.post("/", protect, upload.single("coverImage"), createFundraiser);
router.put("/:id", protect, upload.single("coverImage"), updateFundraiser);
router.patch("/:id/close", protect, closeFundraiser);

export default router;
