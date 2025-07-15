package com.ecommerce.ecomapi.controller;

import com.ecommerce.ecomapi.dto.auth.AuthResponse;
import com.ecommerce.ecomapi.dto.auth.LoginRequest;
import com.ecommerce.ecomapi.dto.auth.RegisterRequest;
import com.ecommerce.ecomapi.response.ApiResponse;
import com.ecommerce.ecomapi.service.auth.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(CREATED).body(new ApiResponse<>("User registered Successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(new ApiResponse<>("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(UNAUTHORIZED).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
