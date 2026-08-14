import {
  upsertGroup,
  upsertGroupProducts,
} from "../../controller/groupController";
import { prisma } from "../../utils/db";
import {
  BN_CATEGORIES,
  KRISPY_KREME_CATEGORIES,
  SCOOPD_CATEGORIES,
} from "../../utils/util";
import foodicsClient from "./client";

export const getGroupsById = async (id: string) => {
  const { data } = await foodicsClient.get(`/groups/${id}`);

  return data.data;
};

export const getGroupsProductsById = async (id: string) => {
  const { data } = await foodicsClient.get(`/groups/${id}?include=products`);

  return data.data;
};

export const syncGroupProducts = async (id: string) => {
  const groups = await getGroupsProductsById(id);
  const products = groups.products;
  for (const prd of products) {
    console.log(prd);
    // await upsertGroupProducts(prd);
  }
  return groups.length;
};

export const syncGroup = async (id: string) => {
  const group = await getGroupsById(id);
  await upsertGroup(group);
};

//// ARTIFICIAL SYNCING

const categories = await prisma.category.findMany({
  where: {
    name: {
      in: SCOOPD_CATEGORIES,
    },
  },
  select: {
    id: true,
    foodicsId: true,
    name: true,
  },
});

export const getProductsFromFoodicsCF = async (categoryId: string) => {
  const { data: firstPage } = await foodicsClient.get(
    `/products?filter[category_id]=${categoryId}&page=1`,
  );

  const allProducts = [...firstPage.data];

  const lastPage = firstPage.meta.last_page;

  for (let page = 2; page <= lastPage; page++) {
    console.log(`Fetching page ${page}`);

    const { data } = await foodicsClient.get(
      `/products?filter[category_id]=${categoryId}&page=${page}`,
    );

    allProducts.push(...data.data);
  }

  // console.log(allProducts.length);

  return allProducts;
};

export const appendCatIdGrpPrd = async () => {
  let allProducts;
  let count = 0;
  for (const category of categories) {
    const products = await getProductsFromFoodicsCF(category.foodicsId);

    const groupProducts = await prisma.groupProducts.findMany();
    const groupProductIds = groupProducts.map((gp) => gp.foodicsId);

    const filteredProducts = products.filter((pr) =>
      groupProductIds.includes(pr.id),
    );
    for (const product of filteredProducts) {
      console.log(count++);
      await upsertGroupProducts(product, category.id);
    }
    allProducts = filteredProducts.length;
  }
  return allProducts;
};
