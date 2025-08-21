package com.ecommerce.ecomapi.service.file;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface IFileStorageService {
    
    String storeFile(MultipartFile file, String directory) throws IOException;
    
    String storeProductImage(MultipartFile file, Long productId) throws IOException;
    
    void deleteFile(String fileName, String directory) throws IOException;
    
    void deleteProductImage(String fileName, Long productId) throws IOException;
    
    Path getFilePath(String fileName, String directory);
    
    byte[] loadFileAsBytes(String fileName, String directory) throws IOException;
    
    boolean fileExists(String fileName, String directory);
}