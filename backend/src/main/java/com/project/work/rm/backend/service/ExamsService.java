package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.mapper.ExamsMapper;
import com.project.work.rm.backend.model.Exam;
import com.project.work.rm.backend.repository.ExamsRepository;
import com.project.work.rm.backend.exception.BusinessRuleException;
import com.project.work.rm.backend.exception.ErrorCode;
import com.project.work.rm.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamsService {
    private final ExamsRepository examsRepository;
    private final ExamsMapper examsMapper;

    public ExamDTO update(Long examID, ExamDTO examDTO) {
        Exam existingExam = findEditableExam(examID);
        examsMapper.updateEntityFromDto(examDTO, existingExam);
        Exam updatedExam = examsRepository.save(existingExam);
        return examsMapper.toDTO(updatedExam);
    }

    public void delete(Long examID) {
        Exam existingExam = findEditableExam(examID);
        // Remove through the owning collection so orphanRemoval keeps the report consistent.
        existingExam.getReport().getExams().remove(existingExam);
        examsRepository.delete(existingExam);
    }

    private Exam findEditableExam(Long examID) {
        Exam exam = examsRepository
                .findById(examID)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.EXAM_NOT_FOUND, "Exam not found with id: " + examID));
        if (exam.getReport().getStatus() == ReportStatus.FINALIZED) {
            throw new BusinessRuleException(ErrorCode.REPORT_NOT_EDITABLE, "Report is already finalized.");
        }
        return exam;
    }
}
