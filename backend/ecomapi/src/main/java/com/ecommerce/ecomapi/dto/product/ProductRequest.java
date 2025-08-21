package com.ecommerce.ecomapi.dto.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
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
    private Boolean isActive = true;
    private Long categoryId;
}