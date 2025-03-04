import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "../query";

export const useAllInventories = () => {
  return useAppQuery(ApiQuery.inventories.getAllInventories());
};
