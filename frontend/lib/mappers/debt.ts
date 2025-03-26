import { DebtNote, DebtPayment, DebtStatus, DebtStatistics } from "@/types/debt";
import { DebtNoteResponseDTO, DebtPaymentResponseDTO, DebtStatisticsDTO } from "@/types/Api";

export const mapDebtNote = (dto: DebtNoteResponseDTO): DebtNote => {
  return {
    id: dto.id || 0,
    partnerId: dto.partnerId || 0,
    partnerName: dto.partnerName || "",
    partnerPhone: dto.partnerPhone || "",
    amount: dto.amount || 0,
    paidAmount: dto.paidAmount || 0,
    dueDate: dto.dueDate || "",
    createdAt: dto.createdAt || "",
    status: (dto.status as DebtStatus) || "PENDING",
    source: dto.source || "",
    orderId: dto.orderId,
    orderAmount: dto.orderAmount || 0,
    description: dto.description || "",
    attachments: dto.attachments || [],
    notes: dto.notes || "",
    payments: (dto.payments || []).map(mapDebtPayment)
  };
};

export const mapDebtPayment = (dto: DebtPaymentResponseDTO): DebtPayment => {
  return {
    id: dto.id || 0,
    amount: dto.amount || 0,
    paymentDate: dto.paymentDate || "",
    paymentMethod: dto.paymentMethod || "",
    receiptNumber: dto.receiptNumber || "",
    notes: dto.notes || "",
    createdAt: dto.createdAt || ""
  };
};

export const mapDebtStatistics = (dto: DebtStatisticsDTO): DebtStatistics => {
  return {
    totalOutstanding: dto.totalOutstanding || 0,
    overdueAmount: dto.overdueAmount || 0,
    upcomingPayments: dto.upcomingPayments || 0
  };
};

// Map một mảng các debt notes
export const mapDebtNotes = (dtos: DebtNoteResponseDTO[]): DebtNote[] => {
  return dtos.map(mapDebtNote);
};