package com.ecommerce.ecomapi.service.product;

import com.ecommerce.ecomapi.entity.Product;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface IProductService {
    Product addProduct(Product product);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    Product updateProduct(Product product, Long id);
    void deleteProduct(Long id);
    Page<Product> getAllProductsPage(int pageNo, int pageSize);
    List<Product> searchProductsByName(String name);
    
    // New methods for enhanced functionality
    List<Product> getProductsByCategory(Long categoryId);
    List<Product> getProductsByBrand(String brand);
    List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> getActiveProducts();
    Product getProductBySku(String sku);
    List<Product> filterProducts(String name, String brand, Long categoryId, 
                               BigDecimal minPrice, BigDecimal maxPrice, Boolean isActive);
}
