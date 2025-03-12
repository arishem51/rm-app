package com.example.backend.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.backend.dto.statistics.RecentOrder;
import com.example.backend.dto.statistics.RevenueByMonthResponse;
import com.example.backend.dto.statistics.StatisticsOverviewResponse;
import com.example.backend.entities.User;
import com.example.backend.enums.ActionStatus;
import com.example.backend.repositories.OrderRepository;
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
        private final OrderRepository orderRepository;

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

        public List<RevenueByMonthResponse> getRevenueByMonth(User currentUser) {
                if (currentUser.getShop() == null) {
                        return new ArrayList<>();
                }

                List<Object[]> results = paymentHistoryRepository
                                .getRevenueByMonthForShop(currentUser.getShop().getId());

                int currentYear = Calendar.getInstance().get(Calendar.YEAR);
                List<String> allMonths = new ArrayList<>();
                for (int month = 1; month <= 12; month++) {
                        allMonths.add(String.format("%d-%02d", currentYear, month));
                }

                Map<String, BigDecimal> revenueMap = new HashMap<>();
                for (Object[] result : results) {
                        String month = (String) result[0];
                        BigDecimal totalRevenue = (BigDecimal) result[1];
                        revenueMap.put(month, totalRevenue);
                }

                List<RevenueByMonthResponse> revenueList = new ArrayList<>();
                for (String month : allMonths) {
                        BigDecimal totalRevenue = revenueMap.getOrDefault(month, BigDecimal.ZERO);
                        revenueList.add(new RevenueByMonthResponse(month, totalRevenue));
                }

                return revenueList;
        }

        public List<RecentOrder> getRecentOrders(User currentUser) {
                if (currentUser.getShop() == null) {
                        return new ArrayList<>();
                }

                return orderRepository
                                .findTop5OrdersByShopIdAndPaymentHistoriesIsDebtFalse(currentUser.getShop().getId(),
                                                PageRequest.of(0, 5))
                                .stream()
                                .map(RecentOrder::fromEntity).toList();
        }

}
