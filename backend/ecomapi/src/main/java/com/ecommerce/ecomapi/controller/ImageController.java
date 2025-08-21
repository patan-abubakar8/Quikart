package com.ecommerce.ecomapi.controller;

import com.ecommerce.ecomapi.entity.ProductImage;
import com.ecommerce.ecomapi.response.ApiResponse;
import com.ecommerce.ecomapi.service.file.IFileStorageService;
import com.ecommerce.ecomapi.service.image.IProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    
    private final IProductImageService productImageService;
    private final IFileStorageService fileStorageService;
    
    @PostMapping("/products/{productId}/upload")
    public ResponseEntity<ApiResponse<ProductImage>> uploadProductImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean isPrimary) {
        try {
            ProductImage productImage = productImageService.uploadProductImage(productId, file, isPrimary);
            return ResponseEntity.status(CREATED)
                    .body(new ApiResponse<>("Image uploaded successfully", productImage));
        } catch (Exception e) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @PostMapping("/products/{productId}/upload-multiple")
    public ResponseEntity<ApiResponse<List<ProductImage>>> uploadMultipleProductImages(
            @PathVariable Long productId,
            @RequestParam("files") MultipartFile[] files) {
        try {
            List<ProductImage> productImages = productImageService.uploadMultipleProductImages(productId, files);
            return ResponseEntity.status(CREATED)
                    .body(new ApiResponse<>("Images uploaded successfully", productImages));
        } catch (Exception e) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<List<ProductImage>>> getProductImages(@PathVariable Long productId) {
        try {
            List<ProductImage> images = productImageService.getProductImages(productId);
            return ResponseEntity.ok(new ApiResponse<>("Images retrieved successfully", images));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @GetMapping("/products/{productId}/primary")
    public ResponseEntity<ApiResponse<ProductImage>> getPrimaryProductImage(@PathVariable Long productId) {
        try {
            ProductImage primaryImage = productImageService.getPrimaryProductImage(productId);
            if (primaryImage == null) {
                return ResponseEntity.status(NOT_FOUND)
                        .body(new ApiResponse<>("No primary image found", null));
            }
            return ResponseEntity.ok(new ApiResponse<>("Primary image retrieved successfully", primaryImage));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @GetMapping("/products/{productId}/{fileName}")
    public ResponseEntity<ByteArrayResource> serveProductImage(
            @PathVariable Long productId,
            @PathVariable String fileName) {
        try {
            String directory = "products/" + productId;
            byte[] imageBytes = fileStorageService.loadFileAsBytes(fileName, directory);
            
            ByteArrayResource resource = new ByteArrayResource(imageBytes);
            
            // Determine content type based on file extension
            String contentType = getContentType(fileName);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(@PathVariable Long imageId) {
        try {
            productImageService.deleteProductImage(imageId);
            return ResponseEntity.ok(new ApiResponse<>("Image deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @PutMapping("/products/{productId}/primary/{imageId}")
    public ResponseEntity<ApiResponse<ProductImage>> setPrimaryImage(
            @PathVariable Long productId,
            @PathVariable Long imageId) {
        try {
            ProductImage primaryImage = productImageService.setPrimaryImage(productId, imageId);
            return ResponseEntity.ok(new ApiResponse<>("Primary image set successfully", primaryImage));
        } catch (Exception e) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @PutMapping("/{imageId}/display-order")
    public ResponseEntity<ApiResponse<ProductImage>> updateDisplayOrder(
            @PathVariable Long imageId,
            @RequestParam Integer displayOrder) {
        try {
            ProductImage updatedImage = productImageService.updateImageDisplayOrder(imageId, displayOrder);
            return ResponseEntity.ok(new ApiResponse<>("Display order updated successfully", updatedImage));
        } catch (Exception e) {
            return ResponseEntity.status(BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    private String getContentType(String fileName) {
        String extension = fileName.toLowerCase();
        if (extension.endsWith(".jpg") || extension.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (extension.endsWith(".png")) {
            return "image/png";
        } else if (extension.endsWith(".gif")) {
            return "image/gif";
        } else if (extension.endsWith(".webp")) {
            return "image/webp";
        }
        return "application/octet-stream";
    }
}