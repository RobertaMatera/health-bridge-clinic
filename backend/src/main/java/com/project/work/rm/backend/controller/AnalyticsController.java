package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.AnalyticsDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    // RF12
    @GetMapping
    public AnalyticsDTO getAll() {
        throw new RuntimeException("Not implemented");
    }
}
