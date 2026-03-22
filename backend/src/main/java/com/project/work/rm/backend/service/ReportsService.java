package com.project.work.rm.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.dto.ReportDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.mapper.ExamsMapper;
import com.project.work.rm.backend.mapper.ReportsMapper;
import com.project.work.rm.backend.model.Exam;
import com.project.work.rm.backend.model.Report;
import com.project.work.rm.backend.model.User;
import com.project.work.rm.backend.repository.ReportsRepository;
import com.project.work.rm.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportsService {
    private final ReportsRepository reportsRepository;
    private final ReportsMapper reportsMapper;
    private final UsersRepository usersRepository;
    private final ExamsMapper examsMapper;

    public List<ReportDTO> getAll() {
        return reportsRepository.findAll().stream()
                .map(reportsMapper::toDTO)
                .toList();
    }

    public ReportDTO create(ReportDTO reportDTO) {
        Report existingReport = reportsMapper.createEntityFromDto(reportDTO);
        validatePatient(reportDTO, existingReport);
        return saveReport(existingReport);
    }

    public ReportDTO update(Long reportID, ReportDTO reportDTO){
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
        existingReport.getExams().add(createdExam);

        return saveReport(existingReport);
    }

    public List<ReportDTO> getReportsByPatientId(Long patientId) {
        User patient = usersRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));

        return reportsRepository.findByPatient(patient).stream()
                .map(reportsMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ReportDTO> getReportsByStatus(ReportStatus status) {
        return reportsRepository.findByStatus(status).stream()
                .map(reportsMapper::toDTO)
                .collect(Collectors.toList());
    }

    private Report findReportById(Long reportID) {
        return reportsRepository.findById(reportID)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportID));
    }

    public List<ReportDTO> getReportsByPatientAndStatus(Long patientID, ReportStatus reportStatus) {
        User patient = usersRepository.findById(patientID)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientID));

        return reportsRepository.findByPatientAndStatus(patient, reportStatus)
                .stream()
                .map(reportsMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ReportDTO getReportById (Long reportID) {
        Report report = findReportById(reportID);
        return reportsMapper.toDTO(report);
    }

    private void checkUpdatableStatus(Report report, boolean isFinalizing) {
        if (report.getStatus() != ReportStatus.IN_PROGRESS && report.getStatus() != ReportStatus.CREATED) {
            String action = isFinalizing ? "finalized" : "modified";
            throw new IllegalStateException("Report can only be " + action + " when in IN_PROGRESS or CREATED status.");
        }
    }

    private ReportDTO updateReport(ReportDTO reportDTO, Report existingReport, Boolean isFinalizing) {
        if(isFinalizing) {
            reportsMapper.finalizeEntityFromDto(reportDTO, existingReport);
            validateReport(existingReport);
        } else {
            reportsMapper.updateEntityFromDto(reportDTO, existingReport);
        }
        return saveReport(existingReport);
    }

    private ReportDTO saveReport( Report existingReport) {
        Report updatedReport = reportsRepository.save(existingReport);
        return reportsMapper.toDTO(updatedReport);
    }

    private void validatePatient(ReportDTO reportDTO, Report existingReport) {
        User patient = usersRepository.findByEmail(reportDTO.getPatient().getEmail())
                .orElseThrow(() -> new RuntimeException("Patient not found!"));

        setPatientInReport(patient, existingReport);
    }

    private void setPatientInReport(User patient, Report existingReport) {
        existingReport.setPatient(patient);
    }

    private void validateReport(Report existingReport) {
        if(existingReport.getExams() == null || existingReport.getExams().isEmpty()) {
            throw new IllegalStateException("Cannot finalize report without exams.");
        }

        if(existingReport.getOutcome() == null || existingReport.getOutcome().isEmpty()) {
            throw new IllegalStateException("Cannot finalize report without an outcome.");
        }
    }
}
