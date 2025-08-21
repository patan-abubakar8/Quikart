package com.ecommerce.ecomapi.service.pdf;

import com.ecommerce.ecomapi.entity.Order;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public interface IPdfService {
    
    ByteArrayOutputStream generateOrderPdf(Order order) throws IOException;
    
    ByteArrayOutputStream generateOrderInvoice(Order order) throws IOException;
    
    byte[] generateOrderReceipt(Long orderId) throws IOException;
}