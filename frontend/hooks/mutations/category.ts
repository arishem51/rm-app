import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import { CreateCategoryDTO, UpdateCategoryDTO } from "@/types/Api";
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

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: async ({ id, ...rest }: UpdateCategoryDTO & { id: number }) => {
      try {
        const response = await apiClient.updateCategory(id, rest);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};
