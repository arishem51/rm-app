package com.example.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.statistics.RecentOrder;
import com.example.backend.dto.statistics.RevenueByMonthResponse;
import com.example.backend.dto.statistics.StatisticsOverviewResponse;
import com.example.backend.entities.User;
import com.example.backend.services.StatisticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/statistics")
@Tag(name = "Statistics Controller", description = "Operations related to Statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final StatisticsService statisticsService;

    @Operation(summary = "Get overview statistics", description = "Fetch overview statistics of the current user.")
    @GetMapping("/overview")
    public ResponseEntity<BaseResponse<StatisticsOverviewResponse>> getOverviewStatistics(@CurrentUser User user) {
        StatisticsOverviewResponse statistics = statisticsService.getOverviewStatistics(user);
        return ResponseEntity.ok(new BaseResponse<>(statistics, "Success!"));
    }

    @Operation(summary = "Get revenue by month statistics", description = "Fetch overview statistics by revenue/month of the current user.")
    @GetMapping("/revenue-by-month")
    public ResponseEntity<BaseResponse<List<RevenueByMonthResponse>>> getRevenueByMonth(@CurrentUser User user) {
        List<RevenueByMonthResponse> statistics = statisticsService.getRevenueByMonth(user);
        return ResponseEntity.ok(new BaseResponse<>(statistics, "Success!"));
    }

    @Operation(summary = "Get recent order", description = "Fetch recent orders of the current user.")
    @GetMapping("/recent-orders")
    public ResponseEntity<BaseResponse<List<RecentOrder>>> getRecentOrders(@CurrentUser User user) {
        List<RecentOrder> statistics = statisticsService.getRecentOrders(user);
        return ResponseEntity.ok(new BaseResponse<>(statistics, "Success!"));
    }
}
