import { useQuery } from "@tanstack/react-query";
import { Product } from "../types/type";
import { getProductDetails, getProducts } from "../services/apiServices";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["Products"],
    queryFn: async () => {
      const res = await getProducts();
      return res.products; // unwrap the { Products: [...] } envelope
    },
  });
};

export const useProductDetails = (id: string) => {
  return useQuery({
    queryKey: ["ProductDeatils", id],
    queryFn: async () => {
      const res = await getProductDetails(id);
      return res; // unwrap the { Products: [...] } envelope
    },
  });
};
