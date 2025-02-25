import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const products = {
  getProducts: createQuery(apiClient.getProducts, {
    placeholderData: keepPreviousData,
  }),
  getProduct: createQuery(apiClient.getProduct),
};
