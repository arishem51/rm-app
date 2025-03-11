package com.example.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.backend.config.CurrentUser;
import com.example.backend.dto.BaseResponse;
import com.example.backend.dto.statistics.StatisticsOverviewResponse;
import com.example.backend.entities.User;
import com.example.backend.services.StatisticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/statistics")
@Tag(name = "StatisticsManagement", description = "Operations related to Statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final StatisticsService statisticsService;

    @Operation(summary = "Get overview statistics", description = "Fetch overview statistics of the current user.")
    @GetMapping("/overview")
    public ResponseEntity<BaseResponse<StatisticsOverviewResponse>> getOverviewStatistics(@CurrentUser User user) {
        StatisticsOverviewResponse statistics = statisticsService.getOverviewStatistics(user);
        return ResponseEntity.ok(new BaseResponse<>(statistics, "Success!"));
    }
}
