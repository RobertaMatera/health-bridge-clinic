package com.project.work.rm.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExamDTO {
    private Long id;
    private String analysis;
    private String unitOfMeasure;
    private Float examValue;
}
