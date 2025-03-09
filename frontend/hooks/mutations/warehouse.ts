import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import { WarehouseCreateDTO, WarehouseUpdateDTO } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateWarehouse = () => {
  return useMutation({
    mutationFn: async (props: WarehouseCreateDTO & { shopId: number }) => {
      try {
        const { shopId, ...rest } = props;
        const response = await apiClient.createWarehouse(shopId, {
          shopId,
          ...rest,
        });
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};

export const useUpdateWarehouse = () => {
  return useMutation({
    mutationFn: async ({
      warehouseId,
      ...rest
    }: WarehouseUpdateDTO & { warehouseId: number }) => {
      try {
        const response = await apiClient.updateWarehouse(warehouseId, rest);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};
