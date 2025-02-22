import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import { SupplierCreateDTO, UpdateSupplierDTO } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateSupplier = () => {
  return useMutation({
    mutationFn: async (props: SupplierCreateDTO) => {
      try {
        const response = await apiClient.createSupplier(props);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};

export const useUpdateSupplier = () =>
  useMutation({
    mutationFn: async ({ id, ...rest }: UpdateSupplierDTO & { id: number }) => {
      try {
        const response = await apiClient.updateSupplier(id, rest);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
