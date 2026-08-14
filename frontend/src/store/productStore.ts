import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FoodicsProduct } from "../types/type";

type productState = {
  products: FoodicsProduct[];
  setProduct: (products: FoodicsProduct[]) => void;
  updateProduct: (productId: string, data: Partial<FoodicsProduct>) => void;
  deleteProduct: (productId: string) => void;
  clearProduct: () => void;
};

export const useproductStore = create<productState>()(
  persist(
    (set) => ({
      products: [],
      setProduct: (products) => set({ products }),

      updateProduct: (productId, data) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...data } : product,
          ),
        })),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => product.id !== productId,
          ),
        })),
      clearProduct: () => set({ products: [] }),
    }),
    {
      name: "product-storage",
    },
  ),
);
