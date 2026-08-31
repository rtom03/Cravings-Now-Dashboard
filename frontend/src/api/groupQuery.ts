import { useQuery } from "@tanstack/react-query";
import { Branches, Groups } from "../types/type";
import {
  getBranchByGroupId,
  getGroups,
  getProductByGroupId,
} from "../services/apiServices";

export const useGroups = (enabled = true) => {
  return useQuery<Groups[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await getGroups();
      return res as Groups[]; // unwrap the { Products: [...] } envelope
    },
    enabled, // query won't fire until this is true
  });
};

export const useSuperGroupById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["brand-branches", id],
    queryFn: async () => {
      const res = await getBranchByGroupId(id);
      // console.log(res);
      return res.branches; // unwrap the { branches: [...] } envelope
    },
    enabled, // query won't fire until this is true
  });
};

export const useProductsByGroupById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await getProductByGroupId(id);
      // console.log(res);
      return res.products; // unwrap the { branches: [...] } envelope
    },
    enabled, // query won't fire until this is true
  });
};
