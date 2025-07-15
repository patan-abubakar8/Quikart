package com.ecommerce.ecomapi.service.order;

import com.ecommerce.ecomapi.dto.order.OrderItemRequest;
import com.ecommerce.ecomapi.dto.order.OrderRequest;
import com.ecommerce.ecomapi.entity.Order;
import com.ecommerce.ecomapi.entity.OrderItem;
import com.ecommerce.ecomapi.entity.Product;
import com.ecommerce.ecomapi.entity.User;
import com.ecommerce.ecomapi.enums.OrderStatus;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.repository.OrderItemRepository;
import com.ecommerce.ecomapi.repository.OrderRepository;
import com.ecommerce.ecomapi.repository.ProductRepository;
import com.ecommerce.ecomapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService{

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    @Override
    public Order placeOrder(OrderRequest request) {
        User user=userRepository.findById(request.getUserId())
                .orElseThrow(()->new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        Order order =new Order();
        order.setUser(user);
        order.setOrderedAt(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems =new ArrayList<>();
        BigDecimal totalAmount =BigDecimal.ZERO;

        for (OrderItemRequest itemRequest:request.getItems()){
            Product product =productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(()-> new ResourceNotFoundException("Product not found with ID: " + itemRequest.getProductId()));
            BigDecimal itemPrice =product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemPrice);
            item.setOrder(order);

            orderItems.add(item);
            totalAmount =totalAmount.add(itemPrice);
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
}
