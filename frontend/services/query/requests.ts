import { apiClient, createQuery } from "@/lib/utils";

export const requests = {
  getAllRequests: createQuery(apiClient.getProductRequests, {}),
};
