package com.project.work.rm.backend.exception;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {
    private final ErrorCode code;

    public ResourceNotFoundException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }
}
