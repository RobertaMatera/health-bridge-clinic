package com.project.work.rm.backend.dto;

import java.time.LocalDate;

/**
 * Number of reports created in the week starting on {@code weekStart} (a Monday).
 */
public record WeeklyCountDTO(LocalDate weekStart, long count) {
}
