import { useQuery } from "@tanstack/react-query";
import { getBranch } from "../services/apiServices";
import { BranchDetails } from "../types/type";

export const useBranch = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: async () => {
      const res = await getBranch(id);
      return res as BranchDetails; // unwrap the { branches: [...] } envelope
    },
    enabled,
  });
};
