import { apiClient } from "@/lib/utils";

import {
    PartnerCreateDTO,
    PartnerUpdateDTO,
} from "@/types/Api";

import { useMutation } from "@tanstack/react-query";
import { createHttpResponseError } from "@/lib/helpers";

export const useCreatePartner = () =>
  useMutation({
    mutationFn: async (props: PartnerCreateDTO) => {
      try {
        const response = await apiClient.createPartner(props);
        return response;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    }
  })

export const useUpdatePartner = () =>
    useMutation({
        mutationFn: async ({ id, ...rest }: PartnerUpdateDTO & { id: number }) => {
            try {
                const response = await apiClient.updatePartner(id, rest);
                return response;
            } catch (error) {
                throw createHttpResponseError(error);
            }
        }
    })

export const useGetPartnerById = () =>
    useMutation({
        mutationFn: async (id: number) => {
            try {
                const response = await apiClient.getPartnerById(id);
                return response;
            } catch (error) {
                throw createHttpResponseError(error);
            }
        }
    })