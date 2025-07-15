package com.ecommerce.ecomapi.service.user;

import com.ecommerce.ecomapi.entity.User;

import java.util.List;

public interface IUserService {
    User registerUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    void deleteUser(Long id);
    User updateUser(Long id, User user);
}
