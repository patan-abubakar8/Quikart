package com.ecommerce.ecomapi.service.file;

import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService implements IFileStorageService {
    
    @Value("${app.file.upload-dir:uploads}")
    private String uploadDir;
    
    private Path getUploadPath(String directory) {
        return Paths.get(uploadDir, directory).toAbsolutePath().normalize();
    }
    
    @Override
    public String storeFile(MultipartFile file, String directory) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }
        
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new IllegalArgumentException("File name cannot be null or empty");
        }
        originalFileName = StringUtils.cleanPath(originalFileName);
        String fileExtension = getFileExtension(originalFileName);
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        Path uploadPath = getUploadPath(directory);
        Files.createDirectories(uploadPath);
        
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        log.info("File stored successfully: {}", fileName);
        return fileName;
    }
    
    @Override
    public String storeProductImage(MultipartFile file, Long productId) throws IOException {
        String directory = "products/" + productId;
        return storeFile(file, directory);
    }
    
    @Override
    public void deleteFile(String fileName, String directory) throws IOException {
        Path filePath = getUploadPath(directory).resolve(fileName);
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            log.info("File deleted successfully: {}", fileName);
        }
    }
    
    @Override
    public void deleteProductImage(String fileName, Long productId) throws IOException {
        String directory = "products/" + productId;
        deleteFile(fileName, directory);
    }
    
    @Override
    public Path getFilePath(String fileName, String directory) {
        return getUploadPath(directory).resolve(fileName);
    }
    
    @Override
    public byte[] loadFileAsBytes(String fileName, String directory) throws IOException {
        Path filePath = getFilePath(fileName, directory);
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("File not found: " + fileName);
        }
        return Files.readAllBytes(filePath);
    }
    
    @Override
    public boolean fileExists(String fileName, String directory) {
        Path filePath = getFilePath(fileName, directory);
        return Files.exists(filePath);
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.'));
    }
}