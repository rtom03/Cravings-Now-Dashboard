import foodicsClient from "./client";

export const getTaxGroupFromFoodics = async () => {
  const { data } = await foodicsClient.get(
    `/tax_groups/975001b2-87f8-464a-9e76-0d355ac627e6?include=taxes`,
  );

  console.log("FOODICS HIT");

  return data.data;
};
