package com.project.work.rm.backend.exception;

/**
 * Stable, machine-readable error codes. The frontend maps them to translated messages,
 * so they must not be renamed without updating the client.
 */
public enum ErrorCode {
    VALIDATION_FAILED,
    MALFORMED_REQUEST,
    INVALID_CREDENTIALS,
    UNAUTHENTICATED,
    ACCESS_DENIED,
    REPORT_NOT_FOUND,
    EXAM_NOT_FOUND,
    PATIENT_NOT_FOUND,
    PATIENT_REQUIRED,
    REPORT_NOT_EDITABLE,
    REPORT_MISSING_EXAMS,
    REPORT_MISSING_OUTCOME,
    INTERNAL_ERROR
}
