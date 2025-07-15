package com.ecommerce.ecomapi.repository;

import com.ecommerce.ecomapi.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem,Long> {

}
