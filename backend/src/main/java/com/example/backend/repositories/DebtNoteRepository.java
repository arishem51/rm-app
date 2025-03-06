package com.example.backend.repositories;

import com.example.backend.entities.DebtNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DebtNoteRepository extends JpaRepository<DebtNote, Long> {
    List<DebtNote> findByPartnerId(Long partnerId);
}
