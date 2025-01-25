import { apiClient, createQuery } from "@/lib/utils";

export const users = {
  getUsers: createQuery(apiClient.getUsers),
};
