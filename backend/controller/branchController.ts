import { Request, Response } from "express";
import { prisma } from "../utils/db";
import { syncBranches } from "../services/foodics/branches.service";
import { FoodicsBranch } from "../types/index.types";

export type IDParams = {
  id: string;
};

const getBranch = async (req: Request<IDParams>, res: Response) => {
  const { id } = req.params;
  try {
    const branch = await prisma.branch.findUnique({
      where: {
        id: id,
      },
      include: {
        branchCategories: {
          include: {
            category: {
              include: { groupProducts: true },
            },
          },
        },
      },
    });
    return res.json({ branch });
  } catch (error: any) {
    console.error("Failed to fetch branches:", error);
    return res.status(500).json({
      message: error?.message || "Failed to fetch branches",
    });
  }
};

const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
    });
    return res.json({ branches });
  } catch (error: any) {
    console.error("Failed to fetch branches:", error);
    return res.status(500).json({
      message: error?.message || "Failed to fetch branches",
    });
  }
};

/// synchronization
const branchSync = async (req: Request, res: Response) => {
  const branches = await await syncBranches();

  return res.json({ branches });
};

/// upsert
const upsertBranch = async (branch: FoodicsBranch) => {
  return prisma.branch.upsert({
    where: {
      foodicsId: branch.id,
    },
    update: {
      name: branch.name,
      nameLocalized: branch.name_localized,
      reference: branch.reference,
      phone: branch.phone,
      latitude: branch.latitude,
      longitude: branch.longitude,
      openingFrom: branch.opening_from,
      openingTo: branch.opening_to,
      receivesOnlineOrders: branch.receives_online_orders,
    },
    create: {
      foodicsId: branch.id,
      name: branch.name,
      nameLocalized: branch.name_localized,
      reference: branch.reference,
      phone: branch.phone,
      latitude: branch.latitude,
      longitude: branch.longitude,
      openingFrom: branch.opening_from,
      openingTo: branch.opening_to,
      inventoryEndOfDayTime: branch.inventory_end_of_day_time,
      receiptHeader: branch.receipt_header,
      receiptFooter: branch.receipt_footer,
      address: branch.address,
      receivesOnlineOrders: branch.receives_online_orders,
      reservationTimes: branch.reservation_times,
      reservationDuration: branch.reservation_duration,
      acceptsReservations: branch.accepts_reservations,
      settings: branch.settings,
    },
  });
};

export { getBranch, getBranches, upsertBranch, branchSync };
