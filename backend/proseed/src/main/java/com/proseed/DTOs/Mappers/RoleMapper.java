package com.proseed.DTOs.Mappers;

import com.proseed.DTOs.RoleDTO;
import com.proseed.entities.Role;

public class RoleMapper {
    public static RoleDTO toRoleDTO(Role role) {
        return new RoleDTO(
            role.getId(),
            role.getName()
        );
    }
}
