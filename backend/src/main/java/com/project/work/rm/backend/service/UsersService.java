package com.project.work.rm.backend.service;

import com.project.work.rm.backend.dto.LoginDTO;
import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.mapper.UsersMapper;
import com.project.work.rm.backend.repository.UsersRepository;
import com.project.work.rm.backend.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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

        throw new InvalidCredentialsException();
    }

    public List<UserDTO> getUsersByRole(UserRole role) {
        return usersRepository
                .findByRole(role)
                .stream()
                .map(usersMapper::toDTO)
                .toList();
    }
}
