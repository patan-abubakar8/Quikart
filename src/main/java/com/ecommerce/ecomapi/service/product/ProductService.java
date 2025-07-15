package com.ecommerce.ecomapi.service.product;

import com.ecommerce.ecomapi.entity.Product;
import com.ecommerce.ecomapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    private final ProductRepository productRepository;
    @Override
    public Product addProduct(Product product) {
        if(productRepository.existsByName(product.getName())) {
            throw new IllegalArgumentException("Product with name " + product.getName() + " already exists.");
        }
        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(()->new ResourceAccessException("Product Not Found with Id : "+id));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product updateProduct(Product product, Long id) {
        Product existedProduct =getProductById(id);
        existedProduct.setName(product.getName());
        existedProduct.setDescription(product.getDescription());
        existedProduct.setPrice(product.getPrice());
        existedProduct.setCategory(product.getCategory());
        return productRepository.save(existedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product existedProduct =getProductById(id);
        productRepository.delete(existedProduct);
    }
}
