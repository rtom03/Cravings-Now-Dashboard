import { upsertCategory } from "../../controller/categoryController";
import foodicsClient from "./client";

export const getCategoriesFromFoodics = async () => {
  const { data: firstPage } = await foodicsClient.get("/categories?page=1");

  const allCategories = [...firstPage.data];

  const lastPage = firstPage.meta.last_page;

  // Fetch remaining pages
  for (let page = 2; page <= lastPage; page++) {
    console.log(`Fetching From ${page}`);
    const { data } = await foodicsClient.get(`/categories?page=${page}`);

    allCategories.push(...data.data);
  }

  console.log(allCategories.length);

  return allCategories;
};

export const getCategoryById = async (catId: string) => {
  const { data } = await foodicsClient.get(`/categories/${catId}`);

  return data.data;
};

export const syncCategories = async () => {
  const categories = await getCategoriesFromFoodics();
  // console.log(branches);
  for (const category of categories) {
    await upsertCategory(category);
  }

  return categories.length;
};
