import { Router } from "express";
import {
  addComment,
  getCommentsByFundraiser,
  deleteComment,
} from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, addComment);
router.get("/fundraiser/:fundraiserId", getCommentsByFundraiser);
router.delete("/:id", protect, deleteComment);

export default router;
