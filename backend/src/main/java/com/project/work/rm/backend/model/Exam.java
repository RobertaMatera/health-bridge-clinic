package com.project.work.rm.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "exam")
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

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;
}