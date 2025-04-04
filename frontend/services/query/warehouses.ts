import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const warehouses = {
  getWarehouses: createQuery(apiClient.getWarehouses, {
    placeholderData: keepPreviousData,
  }),
  getAllWarehouses: createQuery(apiClient.getAllWarehouses),
  getDetails: createQuery(apiClient.getWarehouseDetail),
};
