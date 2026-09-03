import { useMutation } from "@tanstack/react-query";
import { updateModifierOption } from "../services/apiServices";
import { Options } from "../types/type";

export const useUpdateModifierOption = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Options["modifierOption"]>;
    }) => updateModifierOption(id, data),
  });
};
