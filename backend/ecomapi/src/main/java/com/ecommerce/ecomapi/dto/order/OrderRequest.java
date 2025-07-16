package com.ecommerce.ecomapi.dto.order;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;
}
