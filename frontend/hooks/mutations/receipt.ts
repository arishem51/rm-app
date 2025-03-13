import { apiClient } from "@/lib/utils";
import {
  BaseResponseUserDTO,
  HttpResponse,
  ReceiptCreateDTO,
} from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateReceipt = () =>
  useMutation({
    mutationFn: async (data: ReceiptCreateDTO) => {
      try {
        const response = await apiClient.createReceipt(data);
        return response;
      } catch (error) {
        throw new Error(
          (error as HttpResponse<unknown, BaseResponseUserDTO>).error.message
        );
      }
    },
  });
