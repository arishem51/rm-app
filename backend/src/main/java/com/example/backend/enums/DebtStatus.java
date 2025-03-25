package com.example.backend.enums;

public enum DebtStatus {
    PENDING,        // Chưa thanh toán
    PARTIALLY_PAID, // Thanh toán một phần
    PAID,          // Đã thanh toán đủ
    OVERDUE        // Quá hạn
}