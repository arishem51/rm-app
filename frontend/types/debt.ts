export type DebtStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

export interface DebtNote {
    id: number;
    partnerId: number;
    partnerName: string;
    partnerPhone: string;
    amount: number;
    paidAmount: number;
    dueDate: string;
    createdAt: string;
    status: DebtStatus;
    source: string;
    orderId?: number;
    orderAmount?: number;
    description?: string;
    attachments: string[];
    notes?: string;
    payments: DebtPayment[];
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