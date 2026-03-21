package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.mapper.ExamsMapper;
import com.project.work.rm.backend.model.Exam;
import com.project.work.rm.backend.model.Report;
import com.project.work.rm.backend.repository.ExamsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamsService {
    private final ExamsRepository examsRepository;
    private final ExamsMapper examsMapper;

    public ExamDTO update(Long examID, ExamDTO examDTO) {
        Exam existingExam = examsRepository.findById(examID)
                .orElseThrow(() -> new RuntimeException("Exam not found!"));
        examsMapper.updateEntityFromDto(examDTO, existingExam);
        Exam updatedExam = examsRepository.save(existingExam);
        return examsMapper.toDTO(updatedExam);
    }
}
