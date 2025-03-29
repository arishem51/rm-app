package com.example.backend.repositories;

import com.example.backend.entities.DebtDetail;
import com.example.backend.enums.DebtStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DebtDetailRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public Page<DebtDetail> filterDebtDetails(Long debtNoteId, DebtStatus status, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        // Query to retrieve the records
        CriteriaQuery<DebtDetail> criteriaQuery = criteriaBuilder.createQuery(DebtDetail.class);
        Root<DebtDetail> root = criteriaQuery.from(DebtDetail.class);

        List<Predicate> predicates = new ArrayList<>();

        // Lọc theo DebtNoteId
        if (debtNoteId != null) {
            Predicate debtNotePredicate = criteriaBuilder.equal(root.get("debtNote").get("id"), debtNoteId);
            predicates.add(debtNotePredicate);
        }

        // Lọc theo status
        if (status != null) {
            Predicate statusPredicate = criteriaBuilder.equal(root.get("status"), status);
            predicates.add(statusPredicate);
        }

        // Lọc theo từ ngày và đến ngày
        if (fromDate != null && toDate != null) {
            Predicate datePredicate = criteriaBuilder.between(root.get("createdAt"), fromDate, toDate);
            predicates.add(datePredicate);
        }

        // Áp dụng các điều kiện lọc vào truy vấn lấy dữ liệu
        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        // Create a TypedQuery for retrieving the data
        TypedQuery<DebtDetail> query = entityManager.createQuery(criteriaQuery);
        query.setFirstResult((int) pageable.getOffset()); // Set the offset
        query.setMaxResults(pageable.getPageSize()); // Set the page size

        List<DebtDetail> result = query.getResultList();

        // Now, for the count query, we need to create a separate CriteriaQuery
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<DebtDetail> countRoot = countQuery.from(DebtDetail.class); // New Root for counting

        // Apply the same predicates for the count query
        countQuery.select(criteriaBuilder.count(countRoot));
        countQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        // Execute the count query
        Long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        // Return the paginated result
        return new PageImpl<>(result, pageable, totalCount);
    }
}


