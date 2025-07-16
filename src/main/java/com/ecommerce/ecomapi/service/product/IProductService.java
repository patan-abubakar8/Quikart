package com.ecommerce.ecomapi.service.product;

import com.ecommerce.ecomapi.entity.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IProductService {
    Product addProduct(Product product);
    Product getProductById(Long id);
    List<Product> getAllProducts();
    Product updateProduct(Product product, Long id);
    void deleteProduct(Long id);
    Page<Product> getAllProductsPage(int pageNo, int pageSize);
    List<Product> searchProductsByName(String name);
}
