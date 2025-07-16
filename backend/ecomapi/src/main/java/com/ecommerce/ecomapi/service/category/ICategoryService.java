package com.ecommerce.ecomapi.service.category;

import com.ecommerce.ecomapi.entity.Category;

import java.util.List;

public interface ICategoryService {
    Category createCategory(Category category);
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    void deleteCategory(Long id);
}
