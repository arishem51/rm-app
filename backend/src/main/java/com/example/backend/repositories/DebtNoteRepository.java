package com.example.backend.repositories;

import com.example.backend.dto.debt.DebtNoteWithPartnerDTO;
import com.example.backend.entities.DebtNote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DebtNoteRepository extends JpaRepository<DebtNote, Long> {

    @Query("SELECT new com.example.backend.dto.debt.DebtNoteWithPartnerDTO(" +
            "d.id, d.totalAmount, d.status, d.source, d.description, p.name, p.address, p.phone, d.createdAt) " +
            "FROM DebtNote d " +
            "JOIN Partner p ON p.id = d.partnerId " +
            "WHERE " +
            "(p.name = :partnerName OR :partnerName IS NULL) AND " +
            "(d.totalAmount >= :minTotalAmount OR :minTotalAmount IS NULL) AND " +
            "(d.totalAmount <= :maxTotalAmount OR :maxTotalAmount IS NULL) AND " +
            "(d.createdAt >= :fromDate OR :fromDate IS NULL) AND " +
            "(d.createdAt <= :toDate OR :toDate IS NULL) AND " +
            "(d.createdBy = :createdBy OR :createdBy IS NULL)")
    List<DebtNoteWithPartnerDTO> findDebtNotesWithPartner(
            @Param("partnerName") String partnerName,
            @Param("minTotalAmount") Double minTotalAmount,
            @Param("maxTotalAmount") Double maxTotalAmount,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("createdBy") String createdBy);

    Optional<DebtNote> findByPartnerIdAndCreatedBy(Long partnerId, String createdBy);


}
