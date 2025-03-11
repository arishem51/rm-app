import { apiClient, createQuery } from "@/lib/utils";

export const zones = {
  getAllByWarehouse: createQuery(apiClient.getZonesByWarehouseId),
};
