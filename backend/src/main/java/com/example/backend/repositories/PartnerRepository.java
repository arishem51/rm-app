package com.example.backend.repositories;

import com.example.backend.entities.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    Page<Partner> findByNameContainingIgnoreCase(String search, PageRequest pageRequest);
}
