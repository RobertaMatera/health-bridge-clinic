package com.project.work.rm.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;

@Configuration
public class ClockConfig {

    // Injected instead of calling now() directly so time-based logic can be tested.
    @Bean
    public Clock clock() {
        return Clock.systemDefaultZone();
    }
}
