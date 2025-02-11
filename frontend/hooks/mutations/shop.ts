import { apiClient } from "@/lib/utils";
import { BaseResponseUser, CreateShopRequest, HttpResponse } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateShop = () =>
  useMutation({
    mutationFn: async (props: CreateShopRequest) => {
      try {
        const response = await apiClient.createShop(props);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseUser>).error.message
        );
      }
    },
  });
