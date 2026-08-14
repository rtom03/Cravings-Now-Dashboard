import { useQuery } from "@tanstack/react-query";
import { getBranch, getBranches, getGroup } from "../services/apiServices";
import { Branch, BranchResponse, GroupBranch } from "../types/type";

export const useBranches = (id: string) => {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: async () => {
      const res = await getGroup(id);
      return res.branches as GroupBranch[]; // unwrap the { branches: [...] } envelope
    },
  });
};

export const useBranch = (id: string) => {
  return useQuery<BranchResponse>({
    queryKey: ["branch", id],
    queryFn: async () => {
      const res = await getBranch(id);
      return res.branch; // unwrap the { branches: [...] } envelope
    },
  });
};
