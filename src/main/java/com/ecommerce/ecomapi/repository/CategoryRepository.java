package com.ecommerce.ecomapi.repository;

import com.ecommerce.ecomapi.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
}
