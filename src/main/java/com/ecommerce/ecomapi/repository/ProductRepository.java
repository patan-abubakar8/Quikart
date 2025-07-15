package com.ecommerce.ecomapi.repository;

import com.ecommerce.ecomapi.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
}
