import { apiClient } from "@/lib/utils";
import {
  BaseResponseUserDTO,
  CreateShopDTO,
  HttpResponse,
  UpdateShopDTO,
} from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateShop = () =>
  useMutation({
    mutationFn: async (props: CreateShopDTO) => {
      try {
        const response = await apiClient.createShop(props);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseUserDTO>).error.message
        );
      }
    },
  });

export const useUpdateShop = () =>
  useMutation({
    mutationFn: async ({ id, ...rest }: UpdateShopDTO & { id: number }) => {
      try {
        const response = await apiClient.updateShop(id, rest);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseUserDTO>).error.message
        );
      }
    },
  });
