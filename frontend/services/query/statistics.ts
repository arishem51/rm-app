import { apiClient, createQuery } from "@/lib/utils";

export const statistics = {
  getOverview: createQuery(apiClient.getOverviewStatistics),
};
