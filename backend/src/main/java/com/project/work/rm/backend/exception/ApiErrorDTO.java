package com.project.work.rm.backend.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ApiErrorDTO(
        Instant timestamp,
        int status,
        ErrorCode code,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
}
