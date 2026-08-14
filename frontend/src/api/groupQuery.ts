import { useQuery } from "@tanstack/react-query";
import { Groups, Product } from "../types/type";
import { getGroups, getProducts } from "../services/apiServices";

export const useGroups = () => {
  return useQuery<Groups[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await getGroups();
      return res.groups; // unwrap the { Products: [...] } envelope
    },
  });
};
