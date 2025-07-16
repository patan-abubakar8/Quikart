package com.ecommerce.ecomapi.service.order;

import com.ecommerce.ecomapi.dto.order.OrderRequest;
import com.ecommerce.ecomapi.entity.Order;

import java.util.List;

public interface IOrderService {
    Order placeOrder(OrderRequest request);
    Order getOrderById(Long id);
    List<Order> getOrdersByUserId(Long userId);
}
