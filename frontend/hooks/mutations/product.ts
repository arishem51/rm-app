import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import { RequestProductDTO } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (props: RequestProductDTO) => {
      try {
        const response = await apiClient.createProduct(props);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async ({ id, ...rest }: RequestProductDTO & { id: number }) => {
      try {
        const response = await apiClient.updateProduct(id, rest);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};
