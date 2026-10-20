package com.project.work.rm.backend.config;

import com.project.work.rm.backend.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig
        implements WebMvcConfigurer {

    private static final String DOCTOR = "DOCTOR";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                // No WWW-Authenticate header on 401, otherwise the browser opens its native login prompt.
                .httpBasic(basic -> basic.authenticationEntryPoint((request, response, ex) ->
                        writeError(request, response, HttpServletResponse.SC_UNAUTHORIZED, ErrorCode.UNAUTHENTICATED, "Authentication required")))
                .exceptionHandling(handling -> handling.accessDeniedHandler((request, response, ex) ->
                        writeError(request, response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.ACCESS_DENIED, "Access denied")))
                .cors(withDefaults())
                .authorizeHttpRequests(http -> http
                        .requestMatchers("/auth/**").permitAll()
                        // Reading reports is allowed to both roles; ReportsService limits patients to their own.
                        .requestMatchers(HttpMethod.GET, "/reports", "/reports/**").authenticated()
                        .requestMatchers("/reports/**", "/exams/**", "/analytics/**", "/users/**").hasRole(DOCTOR)
                        .anyRequest().authenticated())
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void addCorsMappings(final CorsRegistry registry) {
        registry
                .addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "X-Custom-Header")
                .allowCredentials(true)
                .maxAge(3600);
    }

    // Same shape as ApiErrorDTO; written by hand because these errors happen before the MVC layer.
    private static void writeError(HttpServletRequest request, HttpServletResponse response,
                                   int status, ErrorCode code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8);
        response.getWriter().write("{\"timestamp\":\"%s\",\"status\":%d,\"code\":\"%s\",\"message\":\"%s\",\"path\":\"%s\"}"
                .formatted(Instant.now(), status, code, message, request.getRequestURI()));
    }
}
