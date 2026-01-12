import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { updateProfile, getProfile, updateAvatar } from "../controllers/profile.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", protect, getProfile);           
router.get("/:userId", getProfile);             

// Profile updates
router.put("/", protect, updateProfile);        // PUT /api/profile → Update current user
router.put("/avatar", protect, upload.single("avatar"), updateAvatar); // PUT /api/profile/avatar

export default router;
