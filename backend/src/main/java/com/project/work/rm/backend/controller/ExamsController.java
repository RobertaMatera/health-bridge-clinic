package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.service.ExamsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
public class ExamsController {
    private final ExamsService examsService;

    // RF03 - RF04
    @PutMapping("/{examID}")
    public ExamDTO update(@PathVariable Long examID, @RequestBody ExamDTO examDTO) {
        return examsService.update(examID, examDTO);
    }

    // RF03 - RF04
    @DeleteMapping("/{examID}")
    public ResponseEntity<Void> delete(@PathVariable Long examID) {
        examsService.delete(examID);
        return ResponseEntity.noContent().build();
    }
}
