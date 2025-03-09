import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";


export const payment = {
  getPayment: createQuery(apiClient.getPaymentById, {
    placeholderData: keepPreviousData,
  }),
  getAllPayment: createQuery(apiClient.getAllPayment, {}),

};