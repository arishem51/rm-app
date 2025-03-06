package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transactions")

public class Transaction { @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

    @ManyToOne
    @JoinColumn(name = "partner_id", nullable = false)
    private Partner partner; // Liên kết với Partner

    @ManyToOne
    @JoinColumn(name = "debt_note_id", nullable = true)
    private DebtNote debtNote; // Liên kết với DebtNote (nếu là giao dịch nợ)

    @Column(nullable = false)
    private String transactionType; // "DEBT_ADDED" hoặc "DEBT_PAID"

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount; // Số tiền giao dịch

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // Thời gian giao dịch

    @Column
    private String note; // Ghi chú thêm (tùy chọn)
}
