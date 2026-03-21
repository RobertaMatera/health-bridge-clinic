package com.project.work.rm.backend.dto;

import lombok.Data;

@Data
public class AnalyticsDTO {
    // RF13
    private Long createdReports;
    private Long inProgressReports;
    private Long finalizedReports;
    // RF14
    private Long averageMinutesInProgress;
}
