import { syncProductModifiers } from "../../syncFromFoodics/modifier";
import { prisma } from "../../utils/db";
import { getSyncedModifierProductIds } from "../../utils/util";
import foodicsClient from "./client";

const getProductsFromFoodics = async (id: string) => {
  const data = await foodicsClient.get(`/products/${id}?include=modifiers`);
  //   console.log(data.data);
  return data.data;
};

const syncProductModierModifierOptions = async (id: string) => {
  const data = await getProductsFromFoodics(id);
  await syncProductModifiers(data.data, id);
};

// export const syncAllProductModifiers = async () => {
//   const products = await prisma.groupProducts.findMany({
//     select: {
//       id: true,
//       foodicsId: true,
//     },
//   });

//   const CONCURRENCY = 2;

//   for (let i = 0; i < products.length; i += CONCURRENCY) {
//     const batch = products.slice(i, i + CONCURRENCY);

//     await Promise.all(
//       batch.map((product) =>
//         syncProductModierModifierOptions(product.foodicsId),
//       ),
//     );

//     console.log(
//       `Synced ${Math.min(i + CONCURRENCY, products.length)}/${products.length}`,
//     );
//   }
// };

export const syncAllProductModifiers = async () => {
  const products = await prisma.groupProducts.findMany({
    select: {
      id: true,
      foodicsId: true,
    },
  });

  // Products already processed
  const syncedIds = await getSyncedModifierProductIds();

  // Remove everything already recorded in the file
  const unsyncedProducts = products.filter(
    (product) => !syncedIds.has(product.foodicsId),
  );

  console.log(`Total products: ${products.length}`);
  console.log(`Already synced: ${syncedIds.size}`);
  console.log(`Remaining to sync: ${unsyncedProducts.length}`);

  const CONCURRENCY = 2;

  // Only loop over products that actually need syncing
  for (let i = 0; i < unsyncedProducts.length; i += CONCURRENCY) {
    const batch = unsyncedProducts.slice(i, i + CONCURRENCY);

    console.log(
      `🔄 Syncing batch ${i + 1}-${Math.min(
        i + CONCURRENCY,
        unsyncedProducts.length,
      )} of ${unsyncedProducts.length}`,
    );

    await Promise.all(
      batch.map((product) =>
        syncProductModierModifierOptions(product.foodicsId),
      ),
    );

    console.log(
      `✅ Synced ${Math.min(
        i + CONCURRENCY,
        unsyncedProducts.length,
      )}/${unsyncedProducts.length}`,
    );
  }
};
