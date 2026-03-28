package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.AnalyticsDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.repository.ReportsRepository;
import com.project.work.rm.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UsersRepository usersRepository;
    private final ReportsRepository reportsRepository;

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
                .build();
    }
}
