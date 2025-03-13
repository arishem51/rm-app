package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entities.Receipt;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

}
