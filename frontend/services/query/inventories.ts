import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const inventories = {
  getInventories: createQuery(apiClient.getInventory, {
    placeholderData: keepPreviousData,
  }),
  getAllInventory: createQuery(apiClient.getAllInventory, {}),
  getDetails: createQuery(apiClient.getInventoryById),
};
