package com.project.work.rm.backend.exception;

import lombok.Getter;

/**
 * A request that is well-formed but conflicts with the report lifecycle rules.
 */
@Getter
public class BusinessRuleException extends IllegalStateException {
    private final ErrorCode code;

    public BusinessRuleException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }
}
