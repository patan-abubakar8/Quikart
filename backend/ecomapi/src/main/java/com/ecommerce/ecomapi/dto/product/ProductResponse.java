package com.ecommerce.ecomapi.dto.product;

import com.ecommerce.ecomapi.entity.Category;
import com.ecommerce.ecomapi.entity.ProductImage;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String brand;
    private String model;
    private String sku;
    private String specifications;
    private Double weight;
    private String dimensions;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Category category;
    private List<ProductImage> images;
    private String primaryImageUrl;
}