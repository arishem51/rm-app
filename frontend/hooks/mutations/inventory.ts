import { apiClient } from "@/lib/utils";
import {
  BaseResponseVoid,
  HttpResponse,
  InventoryCreateDTO,
  InventoryUpdateDTO,
} from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateInventory = () =>
  useMutation({
    mutationFn: async (props: InventoryCreateDTO) => {
      try {
        const response = await apiClient.createInventory(props);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseVoid>).error.message
        );
      }
    },
  });

export const useUpdateInventory = () =>
  useMutation({
    mutationFn: async ({
      id,
      ...rest
    }: InventoryUpdateDTO & { id: number }) => {
      try {
        const response = await apiClient.updateInventory(id, rest);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseVoid>).error.message
        );
      }
    },
  });
