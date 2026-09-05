import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateModifierOption } from "../services/apiServices";
import { Options } from "../types/type";

export const useUpdateModifierOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Options["modifierOption"]>;
    }) => updateModifierOption(id, data),
    onSuccess: () => {
      // whatever query key actually supplies `groupProductModifiers`
      // to ProductDetailsModal — invalidate it so refetches (and remounts)
      // pull the persisted image, not stale cached data
      queryClient.invalidateQueries({ queryKey: ["ProductDeatils"] });
    },
  });
};
