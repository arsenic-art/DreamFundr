import { Router } from "express";
import {
  getFundraiserDonations,
  getTopDonors,
  getRecentDonations,
  getDonationStats,
} from "../controllers/donation.controller.js";

const router = Router();

router.get("/fundraiser/:fundraiserId", getFundraiserDonations);
router.get("/fundraiser/:fundraiserId/top-donors", getTopDonors);
router.get("/fundraiser/:fundraiserId/stats", getDonationStats);
router.get("/recent", getRecentDonations);

export default router;
