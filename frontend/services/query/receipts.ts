import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const receipts = {
  getReceipts: createQuery(apiClient.getReceipts, {
    placeholderData: keepPreviousData,
  }),
  getReceipt: createQuery(apiClient.getReceipt),
};
