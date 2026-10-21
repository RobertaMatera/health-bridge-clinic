package com.project.work.rm.backend.dto;

import com.project.work.rm.backend.enums.ReportStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReportDTO {
    private Long id;
    private UserDTO patient;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime finalizedAt;
    private ReportStatus status;
    @Size(max = 2000)
    private String outcome;
    private UserDTO createdBy;
    private List<ExamDTO> exams;
}
    