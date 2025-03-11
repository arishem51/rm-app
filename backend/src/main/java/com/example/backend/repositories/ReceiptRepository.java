package com.example.backend.repositories;

import com.example.backend.entities.Receipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    Page<Receipt> findByShopId(Long shopId, Pageable pageable);
    List<Receipt> findByShopId(Long shopId);

    //Đảm bảo Staff chỉ xem Receipt của Shop mình
    Optional<Receipt> findByIdAndShopId(Long id, Long shopId);
}
