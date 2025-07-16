package com.ecommerce.ecomapi.controller;

import com.ecommerce.ecomapi.entity.Product;
import com.ecommerce.ecomapi.exceptions.AlreadyExistsException;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.response.ApiResponse;
import com.ecommerce.ecomapi.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final IProductService productService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts(){
        List<Product> products =productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse<>("All products Fetched Successfully",products));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Product>> addProduct(@RequestBody Product product) {
        try {
            Product addedProduct = productService.addProduct(product);
            return ResponseEntity.status(CREATED).body(new ApiResponse<>("Product added Successfully", addedProduct));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id){
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(new ApiResponse<>("Product found", product));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null ));
        }
    }

    @PutMapping("/product/{id}/update")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updated = productService.updateProduct(product, id);
            return ResponseEntity.ok(new ApiResponse<>("Product updated", updated));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("/product/{id}/delete")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse<>("Product deleted", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<Page<Product>>> getAllProductsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Product> products = productService.getAllProductsPage(page, size);
        return ResponseEntity.ok(new ApiResponse<>("Products fetched", products));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Product>>> searchProducts(
            @RequestParam String name
    ) {
        List<Product> result = productService.searchProductsByName(name);
        return ResponseEntity.ok(new ApiResponse<>("Search result", result));
    }

}
