package com.project.work.rm.backend.service;

import com.project.work.rm.backend.repository.UsersRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {
    private final UsersRepository usersRepository;

    @Override
    @NonNull
    public UserDetails loadUserByUsername(@NonNull final String email) throws UsernameNotFoundException {
        return usersRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
