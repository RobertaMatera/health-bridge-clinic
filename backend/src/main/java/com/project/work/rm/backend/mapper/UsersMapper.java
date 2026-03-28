package com.project.work.rm.backend.mapper;

import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsersMapper {
    UserDTO toDTO(User user);
    User toEntity(UserDTO userDTO);
}