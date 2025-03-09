import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "../query";

export const useAllWarehouses = (shopId: number) => {
  return useAppQuery(ApiQuery.warehouses.getAllWarehouses({ shopId }));
};
