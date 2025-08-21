package com.ecommerce.ecomapi.service.image;

import com.ecommerce.ecomapi.entity.ProductImage;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IProductImageService {
    
    ProductImage uploadProductImage(Long productId, MultipartFile file, boolean isPrimary) throws IOException;
    
    List<ProductImage> uploadMultipleProductImages(Long productId, MultipartFile[] files) throws IOException;
    
    List<ProductImage> getProductImages(Long productId);
    
    ProductImage getPrimaryProductImage(Long productId);
    
    void deleteProductImage(Long imageId) throws IOException;
    
    void deleteAllProductImages(Long productId) throws IOException;
    
    ProductImage setPrimaryImage(Long productId, Long imageId);
    
    ProductImage updateImageDisplayOrder(Long imageId, Integer displayOrder);
}