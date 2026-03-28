package com.project.work.rm.backend.config;

import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.model.User;
import com.project.work.rm.backend.repository.UsersRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder {
    private final PasswordEncoder passwordEncoder;
    private final UsersRepository usersRepository;

    @PostConstruct
    public void seed() {
        if (usersRepository.count() > 0) {
            return;
        }

        usersRepository.save(User
                .builder()
                .firstName("Giuseppe")
                .lastName("Massari")
                .email("g.massari@gmail.com")
                .password(passwordEncoder.encode("patient1"))
                .role(UserRole.PATIENT)
                .build());

        usersRepository.save(User
                .builder()
                .firstName("Luisa")
                .lastName("Spagnoli")
                .email("spagnoli.luisa@libero.it")
                .password(passwordEncoder.encode("patient2"))
                .role(UserRole.PATIENT)
                .build());

        usersRepository.save(User
                .builder()
                .firstName("Claudia")
                .lastName("Rossi")
                .email("claudiarossi@gmail.com")
                .password(passwordEncoder.encode("doctor1"))
                .role(UserRole.DOCTOR)
                .build());

        usersRepository.save(User
                .builder()
                .firstName("Giorgio")
                .lastName("Poi")
                .email("g.poi@gmail.com")
                .password(passwordEncoder.encode("doctor2"))
                .role(UserRole.DOCTOR)
                .build());
    }
}
