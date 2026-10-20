package com.project.work.rm.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamDTO {
    private Long id;

    @NotBlank
    @Size(max = 120)
    private String analysis;

    @NotBlank
    @Size(max = 30)
    private String unitOfMeasure;

    @NotNull
    private Float examValue;

    private Float refMin;
    private Float refMax;

    private LocalDateTime createdAt;

    @JsonIgnore
    @AssertTrue(message = "refMin must not be greater than refMax")
    public boolean isReferenceRangeValid() {
        return refMin == null || refMax == null || refMin <= refMax;
    }
}
