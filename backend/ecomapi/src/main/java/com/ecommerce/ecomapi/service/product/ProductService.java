package com.ecommerce.ecomapi.service.product;

import com.ecommerce.ecomapi.entity.Category;
import com.ecommerce.ecomapi.entity.Product;
import com.ecommerce.ecomapi.exceptions.AlreadyExistsException;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.repository.CategoryRepository;
import com.ecommerce.ecomapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    @Override
    public Product addProduct(Product product) {
        if (productRepository.existsByName(product.getName())) {
            throw new AlreadyExistsException("Product with name " + product.getName() + " already exists.");
        }

        // Fetch full category using ID
        Long categoryId = product.getCategory().getId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        product.setCategory(category);

        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Product Not Found with Id : "+id));
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product updateProduct(Product product, Long id) {
        Product existedProduct = getProductById(id);
        existedProduct.setName(product.getName());
        existedProduct.setDescription(product.getDescription());
        existedProduct.setPrice(product.getPrice());
        existedProduct.setStockQuantity(product.getStockQuantity());
        
        // Update new attributes
        if (product.getBrand() != null) {
            existedProduct.setBrand(product.getBrand());
        }
        if (product.getModel() != null) {
            existedProduct.setModel(product.getModel());
        }
        if (product.getSku() != null) {
            existedProduct.setSku(product.getSku());
        }
        if (product.getSpecifications() != null) {
            existedProduct.setSpecifications(product.getSpecifications());
        }
        if (product.getWeight() != null) {
            existedProduct.setWeight(product.getWeight());
        }
        if (product.getDimensions() != null) {
            existedProduct.setDimensions(product.getDimensions());
        }
        if (product.getIsActive() != null) {
            existedProduct.setIsActive(product.getIsActive());
        }
        
        // Update category if provided
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + product.getCategory().getId()));
            existedProduct.setCategory(category);
        }
        
        return productRepository.save(existedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product existedProduct =getProductById(id);
        productRepository.delete(existedProduct);
    }

    @Override
    public Page<Product> getAllProductsPage(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo,pageSize);
        return productRepository.findAll(pageable);
    }

    @Override
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        // Verify category exists
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        return productRepository.findByCategoryId(categoryId);
    }
    
    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }
    
    @Override
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    @Override
    public List<Product> getActiveProducts() {
        return productRepository.findByIsActiveTrue();
    }
    
    @Override
    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with SKU: " + sku));
    }
    
    @Override
    public List<Product> filterProducts(String name, String brand, Long categoryId, 
                                      BigDecimal minPrice, BigDecimal maxPrice, Boolean isActive) {
        return productRepository.findProductsWithFilters(name, brand, categoryId, minPrice, maxPrice, isActive);
    }
}
