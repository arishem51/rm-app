package com.example.backend.repositories;

import com.example.backend.entities.DebtDetail;
import com.example.backend.entities.DebtNote;
import com.example.backend.enums.DebtStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
public interface DebtDetailRepository extends JpaRepository<DebtDetail, Long> {

    @Query("SELECT d FROM DebtDetail d WHERE ( d.partnerId = :partnerId ) " +
            "AND (:fromDate IS NULL OR :toDate IS NULL OR d.createdAt BETWEEN :fromDate AND :toDate)")
    Page<DebtDetail> findDebtDetailsByDynamicCriteria(
            Long partnerId,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );



}
