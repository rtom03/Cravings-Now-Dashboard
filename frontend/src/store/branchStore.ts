import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Branch, BranchResponse, GroupBranch } from "../types/type";

type BranchState = {
  branches: BranchResponse["branches"];
  selectedBranch: GroupBranch | null;
  setSelectedBranch: (branch: GroupBranch) => void;
  setBranches: (branches: BranchResponse["branches"]) => void;
  // updateBranch: (branchId: string, data: Partial<Branch>) => void;
  // deleteBranch: (branchId: string) => void;
  clearBranches: () => void;
};

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      branches: [],
      selectedBranch: null,
      setSelectedBranch: (selectedBranch) => set({ selectedBranch }),
      setBranches: (branches) => set({ branches }),

      // updateBranch: (branchId, data) =>
      //   set((state) => ({
      //     branches: state.branches.map((branch) =>
      //       branch.id === branchId ? { ...branch, ...data } : branch,
      //     ),
      //   })),

      // deleteBranch: (branchId) =>
      //   set((state) => ({
      //     branches: state.branches.filter((branch) => branch.id !== branchId),
      //   })),

      clearBranches: () => set({ branches: [] }),
    }),
    {
      name: "branch-storage",
    },
  ),
);
