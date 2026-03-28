package com.project.work.rm.backend.controller;

import java.util.List;

import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.enums.UserRole;
import com.project.work.rm.backend.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UsersController {
    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return usersService.getAll();
    }

    @GetMapping("/patients")
    public List<UserDTO> getPatients() {
        return usersService.getUsersByRole(UserRole.PATIENT);
    }

    @PostMapping
    public UserDTO create(@Valid @RequestBody UserDTO user) {
        return usersService.create(user);
    }
}
