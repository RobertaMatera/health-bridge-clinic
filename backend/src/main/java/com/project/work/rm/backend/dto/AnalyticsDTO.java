package com.project.work.rm.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalyticsDTO {

    private Long createdReports;
    private Long inProgressReports;
    private Long finalizedReports;
    private Long totalReports;

    private Long totalUsers;
    private Long totalPatients;
    private Long totalDoctors;

    private Long averageMinutesInProgress;
}
