import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const orders = {
  getOrders: createQuery(apiClient.getOrders, {
    placeholderData: keepPreviousData,
  }),
  getAllOrders: createQuery(apiClient.getAllOrders, {}),
  deleteOrder: createQuery(apiClient.deleteOrder),
};
