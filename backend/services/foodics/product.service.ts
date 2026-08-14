import {
  upsertProductBranches,
  upsertProducts,
} from "../../controller/productController";
import { prisma } from "../../utils/db";
import foodicsClient from "./client";

//artificial syncing
const KRISPY_KREME_CATEGORIES = [
  "BN DRINKS",
  "BN BURGERS",
  "BN APPETIZERS",
  "BN ADD-ONS",
  "BN DEALS",
  "BN COMBO",
];

// const categories = await prisma.category.findMany({
//   where: {
//     name: {
//       in: KRISPY_KREME_CATEGORIES,
//     },
//   },
//   select: {
//     id: true,
//     foodicsId: true,
//     name: true,
//   },
// });

// export const getProductsFromFoodicsCF = async (categoryId: string) => {
//   const { data: firstPage } = await foodicsClient.get(
//     `/products?filter[category_id]=${categoryId}&page=1`,
//   );

//   const allProducts = [...firstPage.data];

//   const lastPage = firstPage.meta.last_page;

//   for (let page = 2; page <= lastPage; page++) {
//     console.log(`Fetching page ${page}`);

//     const { data } = await foodicsClient.get(
//       `/products?filter[category_id]=${categoryId}&page=${page}`,
//     );

//     allProducts.push(...data.data);
//   }

//   console.log(allProducts.length);

//   return allProducts;
// };

// export const syncProductsWCatFilter = async () => {
//   let allProducts;
//   for (const category of categories) {
//     const products = await getProductsFromFoodicsCF(category.foodicsId);

//     for (const product of products) {
//       await upsertProducts(product, category.id);
//     }
//     allProducts = products.length;
//   }
//   return allProducts;
// };

export const getProductsFromFoodics = async () => {
  const { data: firstPage } = await foodicsClient.get(`/products?page=1`);

  const allProducts = [...firstPage.data];

  const lastPage = firstPage.meta.last_page;

  for (let page = 10; page <= lastPage; page++) {
    console.log(`Fetching page ${page}`);

    const { data } = await foodicsClient.get(`/products?page=${page}`);

    allProducts.push(...data.data);
  }

  console.log(allProducts.length);

  return allProducts;
};
export const getProductById = async (productId: string) => {
  const { data } = await foodicsClient.get(`/products/${productId}`);

  return data.data;
};

export const updateProduct = async (productId: string, payload: unknown) => {
  const { data } = await foodicsClient.put(`/products/${productId}`, payload);

  return data;
};

export const syncProducts = async () => {
  const products = await getProductsFromFoodics();
  // console.log(products);
  for (const product of products) {
    // YOU assign it
    await upsertProducts(product);
    // await upsertProductBranches(savedProduct.id, product.branches);
  }

  return products.length;
};

// getProductsFromFoodics();
