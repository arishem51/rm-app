package com.example.backend.controllers;

import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.order.OrderResponseDTO;
import com.example.backend.dto.payment.PaymentHistoryDetailDTO;
import com.example.backend.dto.payment.PaymentHistoryResponseDTO;
import com.example.backend.entities.Order;
import com.example.backend.entities.PaymentHistory;
import com.example.backend.entities.User;
import com.example.backend.repositories.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment-histories")
@RequiredArgsConstructor
public class PaymentHistoryController {
    private final PaymentHistoryRepository paymentHistoryRepository;
    @GetMapping("/all")
    public ResponseEntity<BaseResponse<List<PaymentHistoryResponseDTO>>> getAllPayment(@CurrentUser User currentUser) {
        List<PaymentHistory> payment = paymentHistoryRepository.findAllByShopId(currentUser.getShop().getId());
        return ResponseEntity.ok(new BaseResponse<>(PaymentHistoryResponseDTO.fromEntity(payment), "Success!"));
    }
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<PaymentHistoryDetailDTO>> getPaymentById(@PathVariable Long id) {
        Optional<PaymentHistory> payment = paymentHistoryRepository.findById(id);
        PaymentHistoryDetailDTO paymentHistoryDetailDTO = PaymentHistoryDetailDTO.fromEntity(payment.get());
        return ResponseEntity.ok(new BaseResponse<>(paymentHistoryDetailDTO, "Success!"));
    }

}
