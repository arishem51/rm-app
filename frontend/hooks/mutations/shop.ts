import { apiClient } from "@/lib/utils";
import { BaseResponseUserDTO, HttpResponse, UpdateShopDTO } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

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
