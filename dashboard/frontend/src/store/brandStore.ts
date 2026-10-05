// store/brandStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Groups } from "../types/type";

interface BrandState {
  brands: Groups[];
  setBrands: (brands: Groups[]) => void;
  selectedBrandId: string | null;
  setSelectedBrandId: (id: string) => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      brands: [],
      setBrands: (brands) => set({ brands }),
      selectedBrandId: null,
      setSelectedBrandId: (id) => set({ selectedBrandId: id }),
    }),
    { name: "selected-brand-id" }, // persisted to localStorage
  ),
);
