package com.example.backend.services;

import org.springframework.stereotype.Service;

import com.example.backend.dto.statistics.StatisticsOverviewResponse;
import com.example.backend.entities.User;
import com.example.backend.enums.ActionStatus;
import com.example.backend.repositories.PaymentHistoryRepository;
import com.example.backend.repositories.ProductRepository;
import com.example.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;

    public StatisticsOverviewResponse getOverviewStatistics(User currentUser) {
        if (currentUser.getShop() == null) {
            return StatisticsOverviewResponse.builder()
                    .totalStaff(0)
                    .totalProduct(0)
                    .totalRevenue(0)
                    .totalDebt(0)
                    .build();
        }

        Long shopId = currentUser.getShop().getId();

        return StatisticsOverviewResponse.builder()
                .totalStaff(
                        userRepository.countByShopIdAndStatus(
                                shopId, ActionStatus.ACTIVE)
                                .intValue())
                .totalProduct(
                        productRepository.countByShopId(
                                shopId).intValue())
                .totalRevenue(
                        paymentHistoryRepository.getTotalRevenue().intValue())
                .totalDebt(
                        paymentHistoryRepository.getTotalDebt().intValue())
                .build();
    }
}
