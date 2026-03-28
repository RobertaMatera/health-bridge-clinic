package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.dto.ReportDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.service.ReportsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportsController {
    private final ReportsService reportsService;

    @GetMapping
    public List<ReportDTO> getAll() {
        return reportsService.getAll();
    }

    // RF10
    @GetMapping("/{reportID}")
    public ReportDTO getByID(@PathVariable Long reportID) {
        return reportsService.getReportById(reportID);
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
    @GetMapping("/in-progress/by-patient/{patientID}")
    public List<ReportDTO> getInProgressByPatient(@PathVariable Long patientID) {
        return reportsService.getReportsByPatientAndStatus(patientID, ReportStatus.IN_PROGRESS);
    }

    @GetMapping("/created/by-patient/{patientID}")
    public List<ReportDTO> getCreatedByPatient(@PathVariable Long patientID) {
        return reportsService.getReportsByPatientAndStatus(patientID, ReportStatus.CREATED);
    }
}
