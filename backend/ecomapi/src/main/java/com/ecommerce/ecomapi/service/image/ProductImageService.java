package com.ecommerce.ecomapi.service.image;

import com.ecommerce.ecomapi.entity.Product;
import com.ecommerce.ecomapi.entity.ProductImage;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.repository.ProductImageRepository;
import com.ecommerce.ecomapi.repository.ProductRepository;
import com.ecommerce.ecomapi.service.file.IFileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductImageService implements IProductImageService {
    
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final IFileStorageService fileStorageService;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    @Override
    @Transactional
    public ProductImage uploadProductImage(Long productId, MultipartFile file, boolean isPrimary) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        
        // Validate file
        validateImageFile(file);
        
        // If setting as primary, unset current primary
        if (isPrimary) {
            productImageRepository.findByProductIdAndIsPrimaryTrue(productId)
                    .ifPresent(currentPrimary -> {
                        currentPrimary.setIsPrimary(false);
                        productImageRepository.save(currentPrimary);
                    });
        }
        
        // Store file
        String fileName = fileStorageService.storeProductImage(file, productId);
        String imageUrl = baseUrl + "/api/images/products/" + productId + "/" + fileName;
        
        // Create ProductImage entity
        ProductImage productImage = new ProductImage();
        productImage.setProduct(product);
        productImage.setFileName(fileName);
        productImage.setOriginalFileName(file.getOriginalFilename());
        productImage.setContentType(file.getContentType());
        productImage.setFileSize(file.getSize());
        productImage.setImageUrl(imageUrl);
        productImage.setIsPrimary(isPrimary);
        productImage.setDisplayOrder(getNextDisplayOrder(productId));
        
        return productImageRepository.save(productImage);
    }
    
    @Override
    @Transactional
    public List<ProductImage> uploadMultipleProductImages(Long productId, MultipartFile[] files) throws IOException {
        List<ProductImage> uploadedImages = new ArrayList<>();
        
        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            boolean isPrimary = i == 0 && !hasPrimaryImage(productId);
            uploadedImages.add(uploadProductImage(productId, file, isPrimary));
        }
        
        return uploadedImages;
    }
    
    @Override
    public List<ProductImage> getProductImages(Long productId) {
        return productImageRepository.findByProductIdOrderByDisplayOrderAsc(productId);
    }
    
    @Override
    public ProductImage getPrimaryProductImage(Long productId) {
        return productImageRepository.findByProductIdAndIsPrimaryTrue(productId)
                .orElse(null);
    }
    
    @Override
    @Transactional
    public void deleteProductImage(Long imageId) throws IOException {
        ProductImage productImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + imageId));
        
        // Delete file from storage
        fileStorageService.deleteProductImage(productImage.getFileName(), productImage.getProduct().getId());
        
        // Delete from database
        productImageRepository.delete(productImage);
        
        log.info("Product image deleted: {}", imageId);
    }
    
    @Override
    @Transactional
    public void deleteAllProductImages(Long productId) throws IOException {
        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(productId);
        
        for (ProductImage image : images) {
            fileStorageService.deleteProductImage(image.getFileName(), productId);
        }
        
        productImageRepository.deleteByProductId(productId);
        log.info("All product images deleted for product: {}", productId);
    }
    
    @Override
    @Transactional
    public ProductImage setPrimaryImage(Long productId, Long imageId) {
        // Unset current primary
        productImageRepository.findByProductIdAndIsPrimaryTrue(productId)
                .ifPresent(currentPrimary -> {
                    currentPrimary.setIsPrimary(false);
                    productImageRepository.save(currentPrimary);
                });
        
        // Set new primary
        ProductImage newPrimary = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + imageId));
        
        if (!newPrimary.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("Image does not belong to the specified product");
        }
        
        newPrimary.setIsPrimary(true);
        return productImageRepository.save(newPrimary);
    }
    
    @Override
    public ProductImage updateImageDisplayOrder(Long imageId, Integer displayOrder) {
        ProductImage productImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + imageId));
        
        productImage.setDisplayOrder(displayOrder);
        return productImageRepository.save(productImage);
    }
    
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }
        
        // Check file size (5MB limit)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size cannot exceed 5MB");
        }
        
        // Check allowed extensions
        String originalFileName = file.getOriginalFilename();
        if (originalFileName != null) {
            String extension = originalFileName.toLowerCase();
            if (!extension.endsWith(".jpg") && !extension.endsWith(".jpeg") && 
                !extension.endsWith(".png") && !extension.endsWith(".gif") && 
                !extension.endsWith(".webp")) {
                throw new IllegalArgumentException("Only JPG, JPEG, PNG, GIF, and WebP files are allowed");
            }
        }
    }
    
    private Integer getNextDisplayOrder(Long productId) {
        long count = productImageRepository.countByProductId(productId);
        return (int) count;
    }
    
    private boolean hasPrimaryImage(Long productId) {
        return productImageRepository.findByProductIdAndIsPrimaryTrue(productId).isPresent();
    }
}