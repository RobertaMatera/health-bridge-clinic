package com.project.work.rm.backend.controller;

import java.util.List;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.dto.ReportDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.service.ReportsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @GetMapping("/by-status/{status}")
    public List<ReportDTO> getFinalizedByStatus(@PathVariable ReportStatus status) {
        return reportsService.getReportsByStatus(status);
    }
}
