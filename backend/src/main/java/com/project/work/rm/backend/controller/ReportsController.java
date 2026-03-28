package com.project.work.rm.backend.controller;

import java.util.List;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.dto.ReportDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.service.ReportsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportsController {
    private final ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping
    public List<ReportDTO> getAll() {
        return reportsService.getAll();
    }

    // RF10
    @GetMapping("/{reportID}")
    public ReportDTO getByID(@PathVariable Long reportID) {
        return reportsService.getReportById(reportID);
    }

    // RF04
    @GetMapping("/{reportID}/exams")
    public List<ExamDTO> getExamsByID(@PathVariable Long reportID) {
        throw new RuntimeException("Not implemented");
    }

    // RF04+RF05 exam creation
    @PostMapping("/{reportID}/exams")
    public ReportDTO createExam(@PathVariable Long reportID, @Valid @RequestBody ExamDTO examDTO) {
        return reportsService.createExam(reportID, examDTO);
    }

    // RF11
    @GetMapping("/{reportID}/pdf")
    public ResponseEntity<byte[]> getPDFByID(@PathVariable Long reportID) {
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf")
                .body(new byte[0]); // TODO: Implement
    }

    // RF09
    @GetMapping("/by-doctor/{doctorID}")
    public List<ReportDTO> getAllByDoctor(@PathVariable Long doctorID) {
        throw new RuntimeException("Not implemented");
    }

    // RF03 report creation
    @PostMapping
    public ReportDTO create(@Valid @RequestBody ReportDTO reportDTO) {
        return reportsService.create(reportDTO);
    }

    // RF04 report update
    @PutMapping("/{reportID}")
    public ReportDTO update(@PathVariable Long reportID, @Valid @RequestBody ReportDTO reportDTO) {
        return reportsService.update(reportID, reportDTO);
    }

    // RF06 report finalization
    @PutMapping("/{reportID}/finalize")
    public ReportDTO finalize(@PathVariable Long reportID, @RequestBody ReportDTO reportDTO) {
        return reportsService.finalize(reportID, reportDTO);
    }

    // RF08
    @GetMapping("/finalized/by-patient/{patientID}")
    public List<ReportDTO> getFinalizedByPatient(@PathVariable Long patientID) {
        return reportsService.getReportsByPatientAndStatus(patientID, ReportStatus.FINALIZED);
    }

    // RF08
    // TODO: inProgress -> in-progress per coerenza con lo stile degli altri URL
    @GetMapping("/inProgress/by-patient/{patientID}")
    public List<ReportDTO> getInProgressByPatient(@PathVariable Long patientID) {
        return reportsService.getReportsByPatientAndStatus(patientID, ReportStatus.IN_PROGRESS);
    }

    @GetMapping("/created/by-patient/{patientID}")
    public List<ReportDTO> getCreatedByPatient(@PathVariable Long patientID) {
        return reportsService.getReportsByPatientAndStatus(patientID, ReportStatus.CREATED);
    }
}
