package com.example.backend.repositories;

import com.example.backend.entities.DebtNote;
import com.example.backend.entities.Partner;
import com.example.backend.enums.DebtStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DebtNoteRepository extends JpaRepository<DebtNote, Long> {
    
    List<DebtNote> findByStatus(DebtStatus status);
    
    List<DebtNote> findByPartner(Partner partner);
    
    List<DebtNote> findByStatusAndPartner(DebtStatus status, Partner partner);
    
    List<DebtNote> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<DebtNote> findByStatusAndDueDateBetween(DebtStatus status, LocalDate startDate, LocalDate endDate);
    
    List<DebtNote> findByPartnerAndDueDateBetween(Partner partner, LocalDate startDate, LocalDate endDate);
    
    List<DebtNote> findByStatusAndPartnerAndDueDateBetween(DebtStatus status, Partner partner, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(d.amount - d.paidAmount) FROM DebtNote d WHERE d.status <> 'PAID'")
    Double getTotalOutstandingAmount();
    
    @Query("SELECT SUM(d.amount - d.paidAmount) FROM DebtNote d WHERE d.status = 'OVERDUE'")
    Double getOverdueAmount();
    
    @Query("SELECT SUM(d.amount - d.paidAmount) FROM DebtNote d WHERE d.status <> 'PAID' AND d.dueDate > CURRENT_DATE AND d.dueDate <= :futureDate")
    Double getUpcomingPayments(LocalDate futureDate);
} 