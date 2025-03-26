import { createHttpResponseError } from "@/lib/helpers";
import { apiClient } from "@/lib/utils";
import {
  CreateDebtNoteDTO,
  CreateDebtPaymentDTO,
  UpdateDebtNoteDTO,
  DebtNote,
  DebtPayment
} from "@/types/debt";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateDebtNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateDebtNoteDTO) => {
      try {
        const response = await apiClient.createDebtNote(data);
        return response.data as DebtNote;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
};

export const useUpdateDebtNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateDebtNoteDTO & { id: number }) => {
      try {
        const response = await apiClient.updateDebtNote(id, data);
        return response.data as DebtNote;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["debt", variables.id] });
    },
  });
};

export const useDeleteDebtNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await apiClient.deleteDebtNote(id);
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
};

export const useCreateDebtPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ debtId, ...data }: CreateDebtPaymentDTO & { debtId: number }) => {
      try {
        const response = await apiClient.createDebtPayment(debtId, data);
        return response.data as DebtPayment;
      } catch (error) {
        throw createHttpResponseError(error);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debt-payments", variables.debtId] });
      queryClient.invalidateQueries({ queryKey: ["debt", variables.debtId] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
    },
  });
};