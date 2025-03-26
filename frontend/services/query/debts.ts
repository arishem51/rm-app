import { apiClient, createQuery } from "@/lib/utils";
import { keepPreviousData } from "@tanstack/react-query";

export const debts = {
  // Lấy danh sách công nợ
  getDebtNotes: createQuery(apiClient.getDebtNotes, {
    placeholderData: keepPreviousData,
  }),

  // Lấy chi tiết công nợ theo ID
  getDebtNoteById: createQuery(apiClient.getDebtNoteById),

  // Lấy danh sách thanh toán của một công nợ
  getDebtPayments: createQuery(apiClient.getDebtPayments),

  // Lấy thống kê công nợ
  getDebtStatistics: createQuery(apiClient.getDebtStatistics),
}; 