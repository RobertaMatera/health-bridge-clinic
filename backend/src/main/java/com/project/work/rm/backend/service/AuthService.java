package com.project.work.rm.backend.service;

import java.util.Optional;

import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    public Optional<User> getCurrentUser() {
        val authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            return Optional.empty();
        }

        return Optional.of((User) authentication.getPrincipal());
    }
}
