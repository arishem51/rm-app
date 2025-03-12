import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import { ZoneRequestDTO } from "@/types/Api";
import { useMutation } from "@tanstack/react-query";

export const useCreateZone = () => {
  return useMutation({
    mutationFn: async (props: ZoneRequestDTO) => {
      try {
        const response = await apiClient.createZone(props);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};

export const useUpdateZone = () => {
  return useMutation({
    mutationFn: async ({ id, ...rest }: ZoneRequestDTO & { id: number }) => {
      try {
        const response = await apiClient.updateZone(id, rest);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
  });
};
