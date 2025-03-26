package com.example.backend.repositories;

import com.example.backend.entities.DebtNote;
import com.example.backend.entities.DebtPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebtPaymentRepository extends JpaRepository<DebtPayment, Long> {
    
    List<DebtPayment> findByDebtNote(DebtNote debtNote);
    
    List<DebtPayment> findByDebtNoteOrderByPaymentDateDesc(DebtNote debtNote);
} 