package com.ecommerce.ecomapi.dto.auth;

import com.ecommerce.ecomapi.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // CUSTOMER or ADMIN
}
