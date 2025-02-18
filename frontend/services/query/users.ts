import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const users = {
  getUsers: createQuery(apiClient.getUsers, {
    placeholderData: keepPreviousData,
  }),
  getMe: createQuery(apiClient.getMe),
};
