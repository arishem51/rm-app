import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "../query";

export const useAllWarehouses = (shopId: number) => {
  return useAppQuery(ApiQuery.warehouses.getAllWarehouses({ shopId }));
};

export const useAllZonesByWarehouses = (warehouseId: number) => {
  return useAppQuery(ApiQuery.zones.getAllByWarehouse(warehouseId));
};

export const useAllZonesByShop = () => {
  return useAppQuery(ApiQuery.zones.getAllByShop());
};
