package com.ecommerce.ecomapi.utils;

import com.ecommerce.ecomapi.entity.Category;
import com.ecommerce.ecomapi.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategorySeeder implements CommandLineRunner {
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        List<String> categories = List.of(
                "Mobiles", "Laptops", "Tablets", "Smart Watches", "Televisions", "Refrigerators",
                "Washing Machines", "Air Conditioners", "Headphones", "Speakers", "Cameras",
                "Printers", "Gaming Consoles", "Monitors", "Keyboards", "Mouse", "Chargers",
                "Power Banks", "Computer Accessories", "Home Appliances", "Kitchen Appliances",
                "Personal Care", "Fitness Equipment", "Books", "Clothing", "Footwear", "Bags",
                "Watches", "Jewellery", "Groceries", "Toys", "Stationery", "Pet Supplies"
        );

        categories.forEach(name -> {
            if (!categoryRepository.existsByNameIgnoreCase(name)) {
                categoryRepository.save(new Category(name));
            }
        });

        System.out.println("Category seeding completed.");
    }
}
