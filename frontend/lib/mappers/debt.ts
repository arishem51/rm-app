import { DebtNote, DebtStatus, DebtStatistics } from "@/types/debt";
import { DebtNoteResponseDTO, DebtStatisticsDTO } from "@/types/Api";

export const mapDebtNote = (dto: DebtNoteResponseDTO): DebtNote => {
  return {
    id: dto.id || 0,
    partnerId: dto.partnerId || 0,
    createdAt: dto.createdAt || "",
    status: (dto.status as DebtStatus) || "PENDING",
    source: dto.source || "",
    orderId: dto.orderId,
    description: dto.description || "",

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