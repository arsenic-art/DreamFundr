import type { Request, Response } from "express";
import prisma from "../prisma.js";
import { uploadImage } from "../utils/cloudinaryUpload.js";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  userId?: string;
}

export const createFundraiser = async (req: MulterRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { title, description, goalAmount } = req.body;

    if (!title || !description || !goalAmount) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (Number(goalAmount) <= 0) {
      return res.status(400).json({ message: "Goal amount must be positive" });
    }

    let coverImageUrl = null;

    if (req.file) {
      coverImageUrl = await uploadImage(
        req.file.buffer,
        "fundraisers",
        `fundraiser_${Date.now()}`
      );
    }

    const fundraiser = await prisma.fundraiser.create({
      data: {
        title,
        description,
        goalAmount: Number(goalAmount),
        coverImage: coverImageUrl,
        userId,
      },
    });

    return res.status(201).json(fundraiser);
  } catch (error) {
    console.error("Create fundraiser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFundraisers = async (_req: Request, res: Response) => {
  try {
    const fundraisers = await prisma.fundraiser.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return res.json(fundraisers);
  } catch (error) {
    console.error("Get fundraisers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFundraiserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Fundraiser ID required" });
    }

    const fundraiser = await prisma.fundraiser.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found" });
    }

    return res.json(fundraiser);
  } catch (error) {
    console.error("Get fundraiser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const closeFundraiser = async (req: MulterRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!id) {
      return res.status(400).json({ message: "Fundraiser ID required" });
    }

    const fundraiser = await prisma.fundraiser.findUnique({
      where: { id },
    });

    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found" });
    }

    if (fundraiser.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await prisma.fundraiser.update({
      where: { id },
      data: { isActive: false },
    });

    return res.json({
      message: "Fundraiser closed successfully",
      fundraiser: updated,
    });
  } catch (error) {
    console.error("Close fundraiser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFundraiser = async (req: MulterRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!id) {
      return res.status(400).json({ message: "Fundraiser ID required" });
    }

    const fundraiser = await prisma.fundraiser.findUnique({
      where: { id },
    });

    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found" });
    }

    if (fundraiser.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let coverImageUrl: string | undefined = undefined;

    if (req.file) {
      coverImageUrl = await uploadImage(
        req.file.buffer,
        "fundraisers",
        `fundraiser_${id}_${Date.now()}`
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (coverImageUrl !== undefined) updateData.coverImage = coverImageUrl;

    const updated = await prisma.fundraiser.update({
      where: { id },
      data: updateData,
    });

    return res.json(updated);
  } catch (error) {
    console.error("Update fundraiser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyFundraisers = async (req: MulterRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const fundraisers = await prisma.fundraiser.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(fundraisers);
  } catch (error) {
    console.error("Get my fundraisers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
