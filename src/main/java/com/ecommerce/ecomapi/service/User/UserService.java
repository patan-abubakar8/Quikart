package com.ecommerce.ecomapi.service.User;

import com.ecommerce.ecomapi.entity.User;
import com.ecommerce.ecomapi.exceptions.AlreadyExistsException;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService{

    private final UserRepository userRepo;
    @Override
    public User registerUser(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new AlreadyExistsException("User already exists with email: " + user.getEmail());
        }
        return userRepo.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        User user = getUserById(id);
        if(user ==null){
            throw new ResourceNotFoundException("User not found with id: " + id);
        }else{
            userRepo.delete(user);
        }
    }

    @Override
    public User updateUser(Long id, User user) {
        User existing = getUserById(id);
        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setPassword(user.getPassword());
        return userRepo.save(existing);
    }

}
