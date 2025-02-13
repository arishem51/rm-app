import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const shops = {
  getShops: createQuery(apiClient.getShops, {
    placeholderData: keepPreviousData,
  }),
  getShopDetails: createQuery(apiClient.getShopById),
};
