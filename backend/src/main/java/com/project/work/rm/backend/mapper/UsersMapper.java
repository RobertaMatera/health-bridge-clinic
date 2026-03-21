package com.project.work.rm.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.project.work.rm.backend.dto.UserDTO;
import com.project.work.rm.backend.model.User;

@Mapper(componentModel = "spring")
public interface UsersMapper {
    @Mapping(target = "password", ignore = true)
    UserDTO toDTO(User user);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "role", source = "role")
    User toEntity(UserDTO userDTO);
}