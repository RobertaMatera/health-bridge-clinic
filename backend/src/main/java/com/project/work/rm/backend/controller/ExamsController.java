package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.ExamDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exams")
public class ExamsController {

    // RF04 - RF05
    @PutMapping("/{examID}")
    public ExamDTO update(@PathVariable Long examID, @RequestBody ExamDTO examDTO) {
        throw new RuntimeException("Error in updating exam with id: " + examID);
    }

    // RF04 - RF05
    @DeleteMapping("/{examID}")
    public void delete(@PathVariable Long examID) {
        throw new RuntimeException("Error in deleting exam with id: " + examID);
    }
}
