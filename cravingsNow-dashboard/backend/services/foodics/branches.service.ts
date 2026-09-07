import { upsertBranch } from "../../controller/branchController";
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

  return branches.length;
};
// export const syncBranch = async (foodicsBranch: FoodicsBranch) => {
//   const branch = await upsertBranch(foodicsBranch);

//   await syncBranchTags(branch.id, foodicsBranch.tags);

//   await syncBranchProducts(branch.id, foodicsBranch.products);

//   await syncBranchDiscounts(branch.id, foodicsBranch.discounts);

//   await syncBranchPromotions(branch.id, foodicsBranch.promotions);

//   await syncBranchDevices(branch.id, foodicsBranch.devices);

//   await syncBranchSections(branch.id, foodicsBranch.sections);

//   await syncBranchCharges(branch.id, foodicsBranch.charges);

//   await syncBranchDeliveryZones(branch.id, foodicsBranch.delivery_zones);

//   await syncBranchUsers(branch.id, foodicsBranch.users);

//   return branch;
// };
