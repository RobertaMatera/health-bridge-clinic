package com.project.work.rm.backend.repository;

import java.util.List;

import com.project.work.rm.backend.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamsRepository extends JpaRepository<Exam, Long>  {
    List<Exam> findByReportId(Long reportId);
}
