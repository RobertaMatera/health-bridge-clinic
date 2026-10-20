package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.AnalyticsDTO;
import com.project.work.rm.backend.dto.WeeklyCountDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.repository.ExamsRepository;
import com.project.work.rm.backend.repository.FinalizationTimes;
import com.project.work.rm.backend.repository.ReportsRepository;
import com.project.work.rm.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    static final int WEEKS = 6;

    private final UsersRepository usersRepository;
    private final ReportsRepository reportsRepository;
    private final ExamsRepository examsRepository;
    private final Clock clock;

    public AnalyticsDTO getAll() {
        return AnalyticsDTO
                .builder()
                .totalUsers(usersRepository.count())
                .totalPatients(usersRepository.countByRole(UserRole.PATIENT))
                .totalDoctors(usersRepository.countByRole(UserRole.DOCTOR))
                .totalReports(reportsRepository.count())
                .createdReports(reportsRepository.countByStatus(ReportStatus.CREATED))
                .inProgressReports(reportsRepository.countByStatus(ReportStatus.IN_PROGRESS))
                .finalizedReports(reportsRepository.countByStatus(ReportStatus.FINALIZED))
                .averageMinutesInProgress(averageMinutesToFinalize())
                .totalExams(examsRepository.count())
                .outOfRangeExams(examsRepository.countOutOfRange())
                .reportsPerWeek(reportsPerWeek())
                .build();
    }

    private Long averageMinutesToFinalize() {
        List<FinalizationTimes> finalized = reportsRepository.findByStatusAndFinalizedAtIsNotNull(ReportStatus.FINALIZED);
        if (finalized.isEmpty()) {
            return null;
        }
        long totalMinutes = finalized
                .stream()
                .mapToLong(times -> Duration.between(times.getCreatedAt(), times.getFinalizedAt()).toMinutes())
                .sum();
        return Math.round((double) totalMinutes / finalized.size());
    }

    private List<WeeklyCountDTO> reportsPerWeek() {
        LocalDate currentWeek = LocalDate.now(clock).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate firstWeek = currentWeek.minusWeeks(WEEKS - 1);

        long[] counts = new long[WEEKS];
        for (LocalDateTime createdAt : reportsRepository.findCreatedAtSince(firstWeek.atStartOfDay())) {
            int index = (int) ChronoUnit.WEEKS.between(firstWeek, createdAt.toLocalDate());
            if (index >= 0 && index < WEEKS) {
                counts[index]++;
            }
        }

        List<WeeklyCountDTO> weeks = new ArrayList<>(WEEKS);
        for (int i = 0; i < WEEKS; i++) {
            weeks.add(new WeeklyCountDTO(firstWeek.plusWeeks(i), counts[i]));
        }
        return weeks;
    }
}
