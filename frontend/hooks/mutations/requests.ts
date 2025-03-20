import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export const useHandleRequest = () => {
  return useMutation({
    mutationFn: async ({id,status}:{id:number,status:boolean} ) => {
      try {
        const response = await apiClient.approveProductRequest(id, { approve: status });
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};

