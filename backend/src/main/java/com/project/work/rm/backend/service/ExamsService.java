package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.mapper.ExamsMapper;
import com.project.work.rm.backend.model.Exam;
import com.project.work.rm.backend.repository.ExamsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamsService {
    private final ExamsRepository examsRepository;
    private final ExamsMapper examsMapper;

    public ExamDTO update(Long examID, ExamDTO examDTO) {
        Exam existingExam = findExamById(examID);
        if (existingExam.getReport().getStatus() == ReportStatus.FINALIZED) {
            throw new IllegalStateException("Report is already finalized.");
        }
        examsMapper.updateEntityFromDto(examDTO, existingExam);
        Exam updatedExam = examsRepository.save(existingExam);
        return examsMapper.toDTO(updatedExam);
    }

    public void delete(Long examID) {
        Exam existingExam = findExamById(examID);
        if (existingExam.getReport().getStatus() == ReportStatus.FINALIZED) {
            throw new IllegalStateException("Report is already finalized.");
        }
        examsRepository.deleteById(examID);
    }

    private Exam findExamById(Long examID) {
        return examsRepository
                .findById(examID)
                .orElseThrow(() -> new RuntimeException("Exam not found!"));
    }
}
