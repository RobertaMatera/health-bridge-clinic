package com.project.work.rm.backend.repository;

import com.project.work.rm.backend.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamsRepository extends JpaRepository<Exam, Long> {
}
