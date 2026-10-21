package com.project.work.rm.backend.service;

import java.util.Optional;

import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService
        implements AuditorAware<User> {

    @Override
    public Optional<User> getCurrentAuditor() {
        return Optional
                .of(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getPrincipal)
                // Anonymous requests carry a String principal, not a User.
                .filter(User.class::isInstance)
                .map(User.class::cast);
    }

    public boolean isDoctor() {
        return getCurrentAuditor()
                .map(User::getRole)
                .map(role -> role.equals(UserRole.DOCTOR))
                .orElse(false);
    }
}
