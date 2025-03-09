import { apiClient } from "@/lib/utils";
import {
  BaseResponseVoid,
  CreateOrderDTO,
  HttpResponse,
  UpdateOrderDTO
} from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateOrder = () =>
  useMutation({
    mutationFn: async (props: CreateOrderDTO) => {
      try {
        const response = await apiClient.createOrder(props);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseVoid>).error.message
        );
      }
    },
  });

export const useUpdateOrder = () =>
  useMutation({
    mutationFn: async ({ id, ...rest }: UpdateOrderDTO & { id: number }) => {
      try {
        const response = await apiClient.updateOrder(id, rest);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseVoid>).error.message
        );
      }
    },
  });
  export const useDeleteOrder = () =>
    useMutation({
      mutationFn: async (id: number) => {
        try {
          const response = await apiClient.deleteOrder(id);
          return response;
        } catch (error) {
          throw new Error(
            (error as HttpResponse<unknown, BaseResponseVoid>).error.message
          );
        }
      },
    });
  