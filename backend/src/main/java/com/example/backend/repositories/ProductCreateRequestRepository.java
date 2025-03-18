package com.example.backend.repositories;

import com.example.backend.entities.ProductCreateRequest;
import com.example.backend.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductCreateRequestRepository extends JpaRepository<ProductCreateRequest, Long> {
    List<ProductCreateRequest> findByShopIdAndStatus(Long shopId, RequestStatus status);
}
