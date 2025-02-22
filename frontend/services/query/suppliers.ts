import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const suppliers = {
  getSuppliers: createQuery(apiClient.getSuppliers, {
    placeholderData: keepPreviousData,
  }),
};
