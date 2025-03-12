import { apiClient, createQuery } from "@/lib/utils";

export const statistics = {
  getOverview: createQuery(apiClient.getOverviewStatistics),
  getRevenueByMonth: createQuery(apiClient.getRevenueByMonth),
  getRecentOrders: createQuery(apiClient.getRecentOrders),
};
