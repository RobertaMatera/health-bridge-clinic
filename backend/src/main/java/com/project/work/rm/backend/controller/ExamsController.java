package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.service.ExamsService;
import com.project.work.rm.backend.service.ReportsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exams")
public class ExamsController {
    private final ExamsService examsService;

    public ExamsController(ExamsService examsService) {
        this.examsService = examsService;
    }

    // RF04 - RF05
    @PutMapping("/{examID}")
    public ExamDTO update(@PathVariable Long examID, @RequestBody ExamDTO examDTO) {
        return examsService.update(examID, examDTO);
    }

    // RF04 - RF05
    @DeleteMapping("/{examID}")
    public ResponseEntity<Void> delete(@PathVariable Long examID) {
        examsService.delete(examID);
        return ResponseEntity.noContent().build();
    }
}
