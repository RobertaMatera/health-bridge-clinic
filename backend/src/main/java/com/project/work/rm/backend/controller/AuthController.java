package com.project.work.rm.backend.controller;

import com.project.work.rm.backend.dto.LoginDTO;
import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.service.UsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final UsersService usersService;

    @PostMapping("/login")
    public UserDTO login(@RequestBody final LoginDTO loginDTO) {
        return usersService.login(loginDTO);
    }
}
