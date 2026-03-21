package com.project.work.rm.backend.mapper;


import com.project.work.rm.backend.dto.ExamDTO;
import com.project.work.rm.backend.model.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamsMapper {
    ExamDTO toDTO(Exam entity);

    @Mapping(target = "id", ignore = true)
    Exam createEntityFromDto(ExamDTO dto);
}
