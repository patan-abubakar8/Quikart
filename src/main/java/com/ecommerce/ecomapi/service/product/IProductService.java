package com.ecommerce.ecomapi.service.product;

import com.ecommerce.ecomapi.entity.Product;

import java.util.List;

public interface IProductService {
    Product addProduct(Product product);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    Product updateProduct(Product product, Long id);
    void deleteProduct(Long id);
}
