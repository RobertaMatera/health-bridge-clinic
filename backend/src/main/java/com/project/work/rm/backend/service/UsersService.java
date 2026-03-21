package com.project.work.rm.backend.service;

import java.util.List;
import java.util.Optional;

import com.project.work.rm.backend.dto.LoginDTO;
import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.mapper.UsersMapper;
import com.project.work.rm.backend.model.User;
import com.project.work.rm.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersService {
    private final UsersRepository usersRepository;
    private final UsersMapper usersMapper;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> getAll() {
        return usersRepository
                .findAll()
                .stream()
                .map(usersMapper::toDTO)
                .toList();
    }

    public Optional<UserDTO> findByEmail(String email) {
        return usersRepository
                .findByEmail(email)
                .map(usersMapper::toDTO);
    }

    public UserDTO login(final LoginDTO loginDTO) {
        val user = usersRepository.findByEmail(loginDTO.getEmail());

        if (user.isPresent() && passwordEncoder.matches(
                loginDTO.getPassword(),
                user
                        .get()
                        .getPassword()
        )) {
            return usersMapper.toDTO(user.get());
        }

        throw new RuntimeException("Invalid username or password");
    }

    public UserDTO create(UserDTO user) {
        User savedUser = usersRepository.save(usersMapper.toEntity(user));
        return usersMapper.toDTO(savedUser);
    }

    public List<UserDTO> getUsersByRole(UserRole role) {
        return usersRepository
                .findByRole(role)
                .stream()
                .map(usersMapper::toDTO)
                .toList();
    }
}
