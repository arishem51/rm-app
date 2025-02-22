import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const categories = {
  getCategories: createQuery(apiClient.getCategories, {
    placeholderData: keepPreviousData,
  }),
};
