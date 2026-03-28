package com.project.work.rm.backend.repository;

import java.util.List;

import com.project.work.rm.backend.enums.ReportStatus;
import com.project.work.rm.backend.model.Report;
import com.project.work.rm.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportsRepository extends JpaRepository<Report, Long> {
    List<Report> findByPatient(User patient);
    List<Report> findByStatus(ReportStatus status);
    List<Report> findByPatientAndStatus(User patient, ReportStatus status);
    long countByStatus(ReportStatus status);
}
