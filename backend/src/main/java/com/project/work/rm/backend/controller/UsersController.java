package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UsersController {
    private final UsersService usersService;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return usersService.getAll();
    }

    @GetMapping("/patients")
    public List<UserDTO> getPatients() {
        return usersService.getUsersByRole(UserRole.PATIENT);
    }
}
