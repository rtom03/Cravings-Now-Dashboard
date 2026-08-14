// store/brandStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BrandState {
  selectedBrandId: string | null;
  setSelectedBrandId: (id: string) => void;
}

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      selectedBrandId: null,
      setSelectedBrandId: (id) => set({ selectedBrandId: id }),
    }),
    { name: "selected-brand-id" }, // persisted to localStorage
  ),
);
