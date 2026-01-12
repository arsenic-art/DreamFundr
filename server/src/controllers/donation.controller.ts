import type { Request, Response } from "express";
import prisma from "../prisma.js";

export const getFundraiserDonations = async (req: Request, res: Response) => {
  try {
    const { fundraiserId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where: { fundraiserId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.donation.count({ where: { fundraiserId } }),
    ]);

    res.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    console.error("Get donations error:", err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

export const getTopDonors = async (req: Request, res: Response) => {
  try {
    const { fundraiserId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const topDonors = await prisma.donation.groupBy({
      by: ["userId"],
      where: { fundraiserId },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: limit,
    });

    const donorsWithDetails = await Promise.all(
      topDonors.map(async (donor) => {
        const user = await prisma.user.findUnique({
          where: { id: donor.userId },
          select: { id: true, name: true },
        });
        return {
          user,
          totalAmount: donor._sum.amount || 0,
          donationCount: donor._count.id,
        };
      })
    );

    res.json({ topDonors: donorsWithDetails });
  } catch (err) {
    console.error("Get top donors error:", err);
    res.status(500).json({ message: "Failed to fetch top donors" });
  }
};

export const getRecentDonations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          fundraiser: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.donation.count(),
    ]);

    res.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    console.error("Get recent donations error:", err);
    res.status(500).json({ message: "Failed to fetch recent donations" });
  }
};

export const getDonationStats = async (req: Request, res: Response) => {
  try {
    const { fundraiserId } = req.params;

    const [stats, topDonation] = await Promise.all([
      prisma.donation.aggregate({
        where: { fundraiserId },
        _count: { id: true },
        _sum: { amount: true },
        _avg: { amount: true },
      }),
      prisma.donation.findFirst({
        where: { fundraiserId },
        orderBy: { amount: "desc" },
        include: {
          user: {
            select: { name: true },
          },
        },
      }),
    ]);

    res.json({
      totalDonations: stats._count.id,
      totalAmount: stats._sum.amount || 0,
      averageAmount: Math.round(stats._avg.amount || 0),
      topDonation: topDonation
        ? {
            amount: topDonation.amount,
            donor: topDonation.user.name,
          }
        : null,
    });
  } catch (err) {
    console.error("Get donation stats error:", err);
    res.status(500).json({ message: "Failed to fetch donation stats" });
  }
};
