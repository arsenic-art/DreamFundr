import type { Request, Response } from "express";
import { uploadImage } from "../utils/cloudinaryUpload.js";
import prisma from "../prisma.js";

interface UpdateProfileInput {
  name?: string;
  bio?: string;
  location?: string;
  avatar?: string;
}

export const updateProfile = async (req: Request<{}, {}, UpdateProfileInput>, res: Response) => {
  try {
    const userId = (req as any).userId!;
    const { name, bio, location, avatar } = req.body;

    if (name && (name.length < 2 || name.length > 50)) {
      return res.status(400).json({ message: "Name must be 2-50 characters" });
    }
    
    if (bio && bio.length > 200) {
      return res.status(400).json({ message: "Bio must be under 200 characters" });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        location: updatedUser.location,
        totalDonated: updatedUser.totalDonated,
        donationCount: updatedUser.donationCount,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const updateAvatar = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const imageUrl = await uploadImage(
      req.file.buffer,
      "avatars",
      req.userId 
    );

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { avatar: imageUrl },
    });

    res.json({
      message: "Avatar updated",
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    let userId: string;
    
    if (req.path === '/profile' || !req.params.userId) {
      userId = (req as any).userId!;
    } 
    else {
      userId = req.params.userId;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: req.userId === userId,
        avatar: true,
        bio: true,
        location: true,
        totalDonated: true,
        donationCount: true,
        isVerified: true,
        createdAt: true,
        fundraisers: {
          select: {
            id: true,
            title: true,
            raisedAmount: true,
            goalAmount: true,
          },
          take: 3,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
