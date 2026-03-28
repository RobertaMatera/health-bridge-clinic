package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.AnalyticsDTO;
import com.project.work.rm.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // RF12
    @GetMapping
    public AnalyticsDTO getAll() {
        return analyticsService.getAll();
    }
}
