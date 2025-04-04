import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "../query";

export const useAllInventories = () => {
  return useAppQuery(ApiQuery.inventories.getAllInventory());
};

export const useInventory = (id: number) => {
  return useAppQuery(ApiQuery.inventories.getDetails(id));
};

export const useInventoryHistory = (id: number) => {
  return useAppQuery(ApiQuery.inventories.getHistory(id));
};
