import fs from "fs/promises";
import path from "path";
import { prisma } from "./db";

const filePath = path.join(process.cwd(), "synced-modifier-products.jsonl");

export const recordModifierProduct = async (productId: string) => {
  console.log(`📝 Recording modifier product: ${productId}`);

  const product = await prisma.groupProducts.findUnique({
    where: {
      foodicsId: productId,
    },
    select: {
      foodicsId: true,
      name: true,
    },
  });

  if (!product) {
    console.warn(
      `Could not record modifier product. Product not found: ${productId}`,
    );
    return;
  }

  const record = {
    productId: product.foodicsId,
    productName: product.name,
  };

  await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, "utf8");
};

export const getSyncedModifierProductIds = async () => {
  try {
    const content = await fs.readFile(filePath, "utf8");

    return new Set(
      content
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const record = JSON.parse(line);

          return record.productId;
        }),
    );
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return new Set<string>();
    }

    throw error;
  }
};

const KRISPY_KREME_CATEGORIES = [
  "KREME DEALS",
  "FATHER'S DAY DOUGHNUT",
  "MINIONS & MONSTERS DOUGHNUTS",
  "SINGLE DOUGHNUTS",
  "DOUGHNUT BOXES",
  "HOT COFFEE",
  "COLD COFFEE",
  "BAKED CREATIONS",
  "CHILLERS",
  "FROZZE SHAKE",
  "ICE KREME",
  "KREME SHAKE",
  "COFFEE BAG",
  "SOFT DRINKS",
  "COMPLIMENTARY",
  "PRE-ORDER",
];

const BN_CATEGORIES = [
  "BN DRINKS",
  "BN BURGERS",
  "BN APPETIZERS",
  "BN ADD-ONS",
  "BN DEALS",
  "BN COMBO",
];

const SCOOPD_CATEGORIES = [
  "SODA",
  "CHICK N CONE",
  "SCOOP'D DEALS",
  "ICE CREAM",
  "PASTRIES",
  "SCOOPD SHAKES",
  "WAFFLES",
  "TOPPINGS",
  "SAVOURY",
  "DESSERTS",
  "SUNDAE",
  "SCOOPD EXTRAS",
  "EXTRAS",
  "SNACKS",
  "COFFEE DRINKS",
];

export { BN_CATEGORIES, KRISPY_KREME_CATEGORIES, SCOOPD_CATEGORIES };
