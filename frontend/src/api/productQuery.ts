import { useQuery } from "@tanstack/react-query";
import { Product } from "../types/type";
import { getProducts } from "../services/apiServices";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["Products"],
    queryFn: async () => {
      const res = await getProducts();
      return res.products; // unwrap the { Products: [...] } envelope
    },
  });
};
