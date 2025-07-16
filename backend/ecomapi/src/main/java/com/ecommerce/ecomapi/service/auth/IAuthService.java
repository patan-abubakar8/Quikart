package com.ecommerce.ecomapi.service.auth;

import com.ecommerce.ecomapi.dto.auth.AuthResponse;
import com.ecommerce.ecomapi.dto.auth.LoginRequest;
import com.ecommerce.ecomapi.dto.auth.RegisterRequest;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
