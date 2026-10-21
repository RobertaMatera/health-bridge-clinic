package com.project.work.rm.backend.repository;

import java.time.LocalDateTime;

public interface FinalizationTimes {
    LocalDateTime getCreatedAt();

    LocalDateTime getFinalizedAt();
}
