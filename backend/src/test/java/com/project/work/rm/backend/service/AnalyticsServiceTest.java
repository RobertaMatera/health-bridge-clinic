package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.AnalyticsDTO;
import com.project.work.rm.backend.dto.WeeklyCountDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.repository.ExamsRepository;
import com.project.work.rm.backend.repository.FinalizationTimes;
import com.project.work.rm.backend.repository.ReportsRepository;
import com.project.work.rm.backend.repository.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    private static final ZoneId ZONE = ZoneId.of("Europe/Rome");
    // Wednesday: the current week starts on Monday 19 October.
    private static final Clock CLOCK = Clock.fixed(ZonedDateTime.of(2026, 10, 21, 10, 0, 0, 0, ZONE).toInstant(), ZONE);

    @Mock
    private UsersRepository usersRepository;
    @Mock
    private ReportsRepository reportsRepository;
    @Mock
    private ExamsRepository examsRepository;

    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        analyticsService = new AnalyticsService(usersRepository, reportsRepository, examsRepository, CLOCK);
        when(usersRepository.count()).thenReturn(8L);
        when(usersRepository.countByRole(UserRole.PATIENT)).thenReturn(6L);
        when(usersRepository.countByRole(UserRole.DOCTOR)).thenReturn(2L);
        when(reportsRepository.count()).thenReturn(5L);
        when(reportsRepository.countByStatus(any())).thenReturn(1L);
        when(examsRepository.count()).thenReturn(12L);
        when(examsRepository.countOutOfRange()).thenReturn(3L);
    }

    @Test
    void reportsCountsAndExams() {
        when(reportsRepository.findByStatusAndFinalizedAtIsNotNull(ReportStatus.FINALIZED)).thenReturn(List.of());
        when(reportsRepository.findCreatedAtSince(any())).thenReturn(List.of());

        AnalyticsDTO analytics = analyticsService.getAll();

        assertThat(analytics.getTotalUsers()).isEqualTo(8L);
        assertThat(analytics.getTotalPatients()).isEqualTo(6L);
        assertThat(analytics.getTotalDoctors()).isEqualTo(2L);
        assertThat(analytics.getTotalExams()).isEqualTo(12L);
        assertThat(analytics.getOutOfRangeExams()).isEqualTo(3L);
    }

    @Test
    void staleCreatedReportsAreThoseCreatedMoreThanTwoDaysAgo() {
        when(reportsRepository.findByStatusAndFinalizedAtIsNotNull(ReportStatus.FINALIZED)).thenReturn(List.of());
        when(reportsRepository.findCreatedAtSince(any())).thenReturn(List.of());
        when(reportsRepository.countByStatusAndCreatedAtBefore(ReportStatus.CREATED, LocalDateTime.of(2026, 10, 19, 10, 0)))
                .thenReturn(2L);

        assertThat(analyticsService.getAll().getStaleCreatedReports()).isEqualTo(2L);
    }

    @Test
    void averageTimeIsNullWithoutFinalizedReports() {
        when(reportsRepository.findByStatusAndFinalizedAtIsNotNull(ReportStatus.FINALIZED)).thenReturn(List.of());
        when(reportsRepository.findCreatedAtSince(any())).thenReturn(List.of());

        assertThat(analyticsService.getAll().getAverageMinutesInProgress()).isNull();
    }

    @Test
    void averageTimeIsTheMeanFromCreationToFinalization() {
        LocalDateTime start = LocalDateTime.of(2026, 10, 1, 9, 0);
        when(reportsRepository.findByStatusAndFinalizedAtIsNotNull(ReportStatus.FINALIZED)).thenReturn(List.of(
                times(start, start.plusMinutes(60)),
                times(start, start.plusMinutes(120))));
        when(reportsRepository.findCreatedAtSince(any())).thenReturn(List.of());

        assertThat(analyticsService.getAll().getAverageMinutesInProgress()).isEqualTo(90L);
    }

    @Test
    void reportsPerWeekCoversTheLastSixWeeksStartingOnMonday() {
        when(reportsRepository.findByStatusAndFinalizedAtIsNotNull(ReportStatus.FINALIZED)).thenReturn(List.of());
        when(reportsRepository.findCreatedAtSince(LocalDateTime.of(2026, 9, 14, 0, 0))).thenReturn(List.of(
                LocalDateTime.of(2026, 9, 14, 0, 0),    // first instant of the oldest week
                LocalDateTime.of(2026, 10, 18, 23, 59), // Sunday of the previous week
                LocalDateTime.of(2026, 10, 19, 0, 0),   // Monday of the current week
                LocalDateTime.of(2026, 10, 21, 9, 0)));

        List<WeeklyCountDTO> weeks = analyticsService.getAll().getReportsPerWeek();

        assertThat(weeks).extracting(WeeklyCountDTO::weekStart).containsExactly(
                LocalDate.of(2026, 9, 14), LocalDate.of(2026, 9, 21), LocalDate.of(2026, 9, 28),
                LocalDate.of(2026, 10, 5), LocalDate.of(2026, 10, 12), LocalDate.of(2026, 10, 19));
        assertThat(weeks).extracting(WeeklyCountDTO::count).containsExactly(1L, 0L, 0L, 0L, 1L, 2L);
    }

    private static FinalizationTimes times(LocalDateTime createdAt, LocalDateTime finalizedAt) {
        return new FinalizationTimes() {
            @Override
            public LocalDateTime getCreatedAt() {
                return createdAt;
            }

            @Override
            public LocalDateTime getFinalizedAt() {
                return finalizedAt;
            }
        };
    }
}
