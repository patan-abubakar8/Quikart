package com.ecommerce.ecomapi.controller;

import com.ecommerce.ecomapi.dto.order.OrderRequest;
import com.ecommerce.ecomapi.entity.Order;
import com.ecommerce.ecomapi.response.ApiResponse;
import com.ecommerce.ecomapi.service.order.IOrderService;
import com.ecommerce.ecomapi.service.pdf.IPdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final IOrderService orderService;
    private final IPdfService pdfService;

    @PostMapping("/place-order")
    public ResponseEntity<ApiResponse<Order>> placeOrder(@RequestBody OrderRequest orderRequest){
        try {
            Order order =orderService.placeOrder(orderRequest);
            return ResponseEntity.ok(new ApiResponse<>("Order placed successfully", order));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(),null));
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long orderId){
        try {
            Order order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(new ApiResponse<>("Order found", order));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/user/{userId}/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByUserId(@PathVariable Long userId) {
        try {
            List<Order> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(new ApiResponse<>("Orders found", orders));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        }
    }
    
    @GetMapping("/{orderId}/download-pdf")
    public ResponseEntity<ByteArrayResource> downloadOrderPdf(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            ByteArrayOutputStream pdfStream = pdfService.generateOrderPdf(order);
            
            ByteArrayResource resource = new ByteArrayResource(pdfStream.toByteArray());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"order-" + orderId + ".pdf\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{orderId}/download-invoice")
    public ResponseEntity<ByteArrayResource> downloadOrderInvoice(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            ByteArrayOutputStream pdfStream = pdfService.generateOrderInvoice(order);
            
            ByteArrayResource resource = new ByteArrayResource(pdfStream.toByteArray());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"invoice-" + orderId + ".pdf\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{orderId}/receipt")
    public ResponseEntity<ByteArrayResource> downloadOrderReceipt(@PathVariable Long orderId) {
        try {
            byte[] receiptBytes = pdfService.generateOrderReceipt(orderId);
            ByteArrayResource resource = new ByteArrayResource(receiptBytes);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"receipt-" + orderId + ".pdf\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}
