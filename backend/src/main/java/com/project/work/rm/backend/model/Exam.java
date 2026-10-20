package com.project.work.rm.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Data
@Table(name = "exam")
@EntityListeners(AuditingEntityListener.class)
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Analysis is required")
    private String analysis;

    @NotBlank(message = "Unit Of Measure is required")
    private String unitOfMeasure;

    @NotNull(message = "Exam Value is required")
    private Float examValue;

    // Optional bounds of the reference interval; either one may be missing (e.g. "< 200").
    private Float refMin;

    private Float refMax;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}