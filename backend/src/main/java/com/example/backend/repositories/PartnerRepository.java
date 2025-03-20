package com.example.backend.repositories;

import com.example.backend.entities.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    Page<Partner> findByNameContainingIgnoreCase(String search, Pageable pageable);
    
    Page<Partner> findByShopId(Long shopId, Pageable pageable);
    
    Page<Partner> findByShopIdAndNameContainingIgnoreCase(Long shopId, String search, Pageable pageable);
    
    List<Partner> findByShopId(Long shopId);
}
