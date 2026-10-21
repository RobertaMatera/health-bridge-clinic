package com.project.work.rm.backend.repository;

import com.project.work.rm.backend.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ExamsRepository extends JpaRepository<Exam, Long> {

    @Query("""
            select count(e) from Exam e
            where (e.refMin is not null and e.examValue < e.refMin)
               or (e.refMax is not null and e.examValue > e.refMax)
            """)
    long countOutOfRange();
}
