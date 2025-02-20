import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import { CreateCategoryDTO } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: async (props: CreateCategoryDTO) => {
      try {
        const response = await apiClient.createCategory(props);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};
