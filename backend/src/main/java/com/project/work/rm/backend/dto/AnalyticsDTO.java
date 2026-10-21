package com.project.work.rm.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AnalyticsDTO {

    private Long createdReports;
    private Long inProgressReports;
    private Long finalizedReports;
    private Long totalReports;

    @Schema(description = "Reports still in CREATED status more than 2 days after creation")
    private Long staleCreatedReports;

    private Long totalUsers;
    private Long totalPatients;
    private Long totalDoctors;

    @Schema(description = "Average minutes from creation to finalization of finalized reports; null when none is finalized")
    private Long averageMinutesInProgress;

    private Long totalExams;

    @Schema(description = "Exams whose value lies outside their reference range")
    private Long outOfRangeExams;

    @Schema(description = "Reports created per week over the last 6 weeks, oldest first")
    private List<WeeklyCountDTO> reportsPerWeek;
}
