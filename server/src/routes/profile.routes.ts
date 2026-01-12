import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { updateProfile, getProfile, updateAvatar } from "../controllers/profile.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", protect, getProfile);           
router.get("/:userId", getProfile);             

router.put("/", protect, updateProfile);      
router.put("/avatar", protect, upload.single("avatar"), updateAvatar); 

export default router;
