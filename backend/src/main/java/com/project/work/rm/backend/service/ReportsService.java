package com.project.work.rm.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.dto.ReportDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.mapper.ExamsMapper;
import com.project.work.rm.backend.mapper.ReportsMapper;
import com.project.work.rm.backend.model.Exam;
import com.project.work.rm.backend.model.Report;
import com.project.work.rm.backend.model.User;
import com.project.work.rm.backend.repository.ReportsRepository;
import com.project.work.rm.backend.repository.UsersRepository;
import com.project.work.rm.backend.exception.BusinessRuleException;
import com.project.work.rm.backend.exception.ErrorCode;
import com.project.work.rm.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportsService {
    private final ReportsRepository reportsRepository;
    private final ReportsMapper reportsMapper;
    private final UsersRepository usersRepository;
    private final ExamsMapper examsMapper;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public List<ReportDTO> getAll() {
        if (authService.isDoctor()) {
            return reportsRepository
                    .findAllByCreatedBy(authService
                            .getCurrentAuditor()
                            .get())
                    .stream()
                    .map(reportsMapper::toDTO)
                    .toList();
        } else {
            return reportsRepository
                    .findAllByPatient(authService
                            .getCurrentAuditor()
                            .get())
                    .stream()
                    .map(reportsMapper::toDTO)
                    .toList();
        }
    }

    public ReportDTO create(ReportDTO reportDTO) {
        Report existingReport = reportsMapper.createEntityFromDto(reportDTO);
        validatePatient(reportDTO, existingReport);
        return saveReport(existingReport);
    }

    public ReportDTO update(Long reportID, ReportDTO reportDTO) {
        Report existingReport = findReportById(reportID);
        checkUpdatableStatus(existingReport, false);
        return updateReport(reportDTO, existingReport, false);
    }

    public ReportDTO finalize(Long reportID, ReportDTO reportDTO) {
        Report existingReport = findReportById(reportID);
        checkUpdatableStatus(existingReport, true);
        validatePatient(reportDTO, existingReport);
        return updateReport(reportDTO, existingReport, true);
    }

    public ReportDTO createExam(Long reportID, ExamDTO examDTO) {
        Report existingReport = findReportById(reportID);
        checkUpdatableStatus(existingReport, false);

        if (existingReport.getStatus() == ReportStatus.CREATED) {
            existingReport.setStatus(ReportStatus.IN_PROGRESS);
        }

        Exam createdExam = examsMapper.createEntityFromDto(examDTO);
        createdExam.setReport(existingReport);
        existingReport
                .getExams()
                .add(createdExam);

        return saveReport(existingReport);
    }

    @Transactional(readOnly = true)
    public List<ReportDTO> getReportsByStatus(ReportStatus status) {
        if (authService.isDoctor()) {
            return reportsRepository
                    .findAllByCreatedByAndStatus(
                            authService
                                    .getCurrentAuditor()
                                    .get(), status)
                    .stream()
                    .map(reportsMapper::toDTO)
                    .collect(Collectors.toList());
        } else {
            return reportsRepository
                    .findAllByPatientAndStatus(
                            authService
                                    .getCurrentAuditor()
                                    .get(), status
                    )
                    .stream()
                    .map(reportsMapper::toDTO)
                    .collect(Collectors.toList());
        }
    }

    private Report findReportById(Long reportID) {
        return reportsRepository
                .findById(reportID)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.REPORT_NOT_FOUND, "Report not found with id: " + reportID));
    }

    @Transactional(readOnly = true)
    public ReportDTO getReportById(Long reportID) {
        Report report = findReportById(reportID);
        checkReadAccess(report);
        return reportsMapper.toDTO(report);
    }

    // Patients may only read their own reports. Answer 404 rather than 403 so ids of other
    // patients' reports cannot be probed.
    private void checkReadAccess(Report report) {
        if (authService.isDoctor()) {
            return;
        }
        Long currentUserId = authService.getCurrentAuditor().map(User::getId).orElse(null);
        if (report.getPatient() == null || !report.getPatient().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException(ErrorCode.REPORT_NOT_FOUND, "Report not found with id: " + report.getId());
        }
    }

    private void checkUpdatableStatus(Report report, boolean isFinalizing) {
        if (report.getStatus() != ReportStatus.IN_PROGRESS && report.getStatus() != ReportStatus.CREATED) {
            String action = isFinalizing ? "finalized" : "modified";
            throw new BusinessRuleException(ErrorCode.REPORT_NOT_EDITABLE,
                    "Report can only be " + action + " when in IN_PROGRESS or CREATED status.");
        }
    }

    private ReportDTO updateReport(ReportDTO reportDTO, Report existingReport, Boolean isFinalizing) {
        if (isFinalizing) {
            reportsMapper.finalizeEntityFromDto(reportDTO, existingReport);
            validateReport(existingReport);
        } else {
            reportsMapper.updateEntityFromDto(reportDTO, existingReport);
        }
        return saveReport(existingReport);
    }

    private ReportDTO saveReport(Report existingReport) {
        Report updatedReport = reportsRepository.save(existingReport);
        return reportsMapper.toDTO(updatedReport);
    }

    private void validatePatient(ReportDTO reportDTO, Report existingReport) {
        if (reportDTO.getPatient() == null || reportDTO.getPatient().getEmail() == null) {
            throw new BusinessRuleException(ErrorCode.PATIENT_REQUIRED, "A patient is required.");
        }

        User patient = usersRepository
                .findByEmail(reportDTO
                        .getPatient()
                        .getEmail())
                .filter(user -> user.getRole() == UserRole.PATIENT)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PATIENT_NOT_FOUND, "Patient not found."));

        setPatientInReport(patient, existingReport);
    }

    private void setPatientInReport(User patient, Report existingReport) {
        existingReport.setPatient(patient);
    }

    private void validateReport(Report existingReport) {
        if (existingReport.getExams() == null || existingReport
                .getExams()
                .isEmpty()) {
            throw new BusinessRuleException(ErrorCode.REPORT_MISSING_EXAMS, "Cannot finalize report without exams.");
        }

        if (existingReport.getOutcome() == null || existingReport
                .getOutcome()
                .isBlank()) {
            throw new BusinessRuleException(ErrorCode.REPORT_MISSING_OUTCOME, "Cannot finalize report without an outcome.");
        }
    }
}
