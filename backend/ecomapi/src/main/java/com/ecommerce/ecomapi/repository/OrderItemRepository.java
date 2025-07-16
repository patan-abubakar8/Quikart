package com.ecommerce.ecomapi.repository;

import com.ecommerce.ecomapi.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}