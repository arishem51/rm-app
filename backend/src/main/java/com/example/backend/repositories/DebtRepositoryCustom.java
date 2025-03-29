package com.example.backend.repositories;

import com.example.backend.entities.DebtNote;
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
public class DebtRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public Page<DebtNote> filterDebtNotes(String partnerId, Double minTotalAmount, Double maxTotalAmount,
                                          LocalDateTime fromDate, LocalDateTime toDate, String createdBy, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

        // Truy vấn dữ liệu
        CriteriaQuery<DebtNote> criteriaQuery = criteriaBuilder.createQuery(DebtNote.class);
        Root<DebtNote> root = criteriaQuery.from(DebtNote.class);
        List<Predicate> predicates = buildPredicates(criteriaBuilder, root, partnerId, minTotalAmount, maxTotalAmount, fromDate, toDate, createdBy);
        criteriaQuery.select(root).where(predicates.toArray(new Predicate[0]));
        TypedQuery<DebtNote> query = entityManager.createQuery(criteriaQuery);
        query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        query.setMaxResults(pageable.getPageSize());
        List<DebtNote> results = query.getResultList();

        // Truy vấn tổng số bản ghi
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<DebtNote> countRoot = countQuery.from(DebtNote.class);
        countQuery.select(criteriaBuilder.count(countRoot)).where(predicates.toArray(new Predicate[0]));
        Long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(results, pageable, totalCount);
    }

    private List<Predicate> buildPredicates(CriteriaBuilder criteriaBuilder, Root<DebtNote> root,
                                            String partnerId, Double minTotalAmount, Double maxTotalAmount,
                                            LocalDateTime fromDate, LocalDateTime toDate, String createdBy) {
        List<Predicate> predicates = new ArrayList<>();

        if (partnerId != null && !partnerId.isEmpty()) {
            predicates.add(criteriaBuilder.equal(root.get("partnerId"), partnerId));
        }
        if (minTotalAmount != null && maxTotalAmount != null) {
            predicates.add(criteriaBuilder.between(root.get("totalAmount"), minTotalAmount, maxTotalAmount));
        }
        if (fromDate != null && toDate != null) {
            predicates.add(criteriaBuilder.between(root.get("createdAt"), fromDate, toDate));
        }
        if (createdBy != null && !createdBy.isEmpty()) {
            predicates.add(criteriaBuilder.equal(root.get("createdBy"), createdBy));
        }

        return predicates;
    }
}
