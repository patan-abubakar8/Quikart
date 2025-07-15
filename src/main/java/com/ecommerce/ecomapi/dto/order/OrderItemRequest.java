package com.ecommerce.ecomapi.dto.order;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemRequest {
    private Long productId;
    private int quantity;
}
