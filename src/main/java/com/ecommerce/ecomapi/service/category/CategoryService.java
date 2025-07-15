package com.ecommerce.ecomapi.service.category;

import com.ecommerce.ecomapi.entity.Category;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService  implements  ICategoryService{

    private  final CategoryRepository categoryRepository;
    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
