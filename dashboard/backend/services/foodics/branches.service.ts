import { FoodicsBranch } from "../../types/index.types";
import { prisma } from "../../utils/db";
import foodicsClient from "./client";

export const getBranchesFromFoodics = async () => {
  const { data } = await foodicsClient.get("/branches");

  return data.data;
};

export const getBranchById = async (branchId: string) => {
  const { data } = await foodicsClient.get(`/branches/${branchId}`);

  return data.data;
};

export const updateBranch = async (branchId: string, payload: unknown) => {
  const { data } = await foodicsClient.put(`/branches/${branchId}`, payload);

  return data;
};

export const syncBranches = async () => {
  const branches = await getBranchesFromFoodics();
  // console.log(branches);
  for (const branch of branches) {
    await upsertBranch(branch);
  }

  console.log("DONE");
};

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
