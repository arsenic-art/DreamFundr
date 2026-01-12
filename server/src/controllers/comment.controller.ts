import type { Request, Response } from "express";
import prisma from "../prisma.js";

export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { fundraiserId, content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!fundraiserId || !content) {
      return res.status(400).json({ message: "All fields required" });
    }

    const fundraiser = await prisma.fundraiser.findUnique({
      where: { id: fundraiserId },
    });

    if (!fundraiser || !fundraiser.isActive) {
      return res.status(404).json({ message: "Fundraiser not found or closed" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        fundraiserId,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getCommentsByFundraiser = async (
  req: Request,
  res: Response
) => {
  try {
    const { fundraiserId } = req.params;

    if (!fundraiserId) {
      return res.status(400).json({ message: "Fundraiser ID required" });
    }

    const comments = await prisma.comment.findMany({
      where: { fundraiserId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!id) {
      return res.status(400).json({ message: "Comment ID required" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
