package com.ecommerce.ecomapi.repository;

import com.ecommerce.ecomapi.entity.Cart;
import com.ecommerce.ecomapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}