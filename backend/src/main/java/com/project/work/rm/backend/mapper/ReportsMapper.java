package com.project.work.rm.backend.mapper;

import com.project.work.rm.backend.dto.ReportDTO;
import com.project.work.rm.backend.model.Report;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UsersMapper.class, ExamsMapper.class})
public interface ReportsMapper {
    ReportDTO toDTO(Report report);

    Report toEntity(ReportDTO reportDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "exams", ignore = true)
    void baseUpdate(ReportDTO dto, @MappingTarget Report report);

    @InheritConfiguration(name = "baseUpdate")
    @Mapping(target = "status", constant = "CREATED")
    Report createEntityFromDto(ReportDTO dto);

    // standard update
    @InheritConfiguration(name = "baseUpdate")
    @Mapping(target = "status", constant = "IN_PROGRESS")
    void updateEntityFromDto(ReportDTO dto, @MappingTarget Report report);

    // finalize
    @InheritConfiguration(name = "baseUpdate")
    @Mapping(target = "status", constant = "FINALIZED")
    @Mapping(target = "finalizedAt", expression = "java(java.time.LocalDateTime.now())")
    void finalizeEntityFromDto(ReportDTO dto, @MappingTarget Report report);
}