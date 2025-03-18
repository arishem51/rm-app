import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const partners = {
  getPartners: createQuery(apiClient.getPartners, {
    placeholderData: keepPreviousData,
  }),
  getAllPartners: createQuery(apiClient.getAllPartners, {}),
};
