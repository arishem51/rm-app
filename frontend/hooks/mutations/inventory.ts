import { apiClient } from "@/lib/utils";
import {
  BaseResponseVoid,
  HttpResponse,
  InventoryUpdateDTO,
} from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

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
