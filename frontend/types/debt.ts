export type DebtStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

export interface DebtNote {
    id: number;
    partnerId: number;
    createdAt: string;
    status: DebtStatus;
    totalAmount: number;
    source: string;
    orderId?: number;
    description?: string;
}

export interface DebtPayment {
    id: number;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    receiptNumber?: string;
    notes?: string;
    createdAt: string;
}

export interface CreateDebtNoteDTO {
    partnerId: number;
    amount: number;
    dueDate: string;
    source?: string;
    orderId?: number;
    description?: string;
    attachments?: string[];
    notes?: string;
}

export interface UpdateDebtNoteDTO {
    partnerId?: number;
    amount?: number;
    dueDate?: string;
    status?: DebtStatus;
    description?: string;
    attachments?: string[];
    notes?: string;
}

export interface CreateDebtPaymentDTO {
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    receiptNumber?: string;
    notes?: string;
}

export interface DebtStatistics {
    totalOutstanding: number;
    overdueAmount: number;
    upcomingPayments: number;
}