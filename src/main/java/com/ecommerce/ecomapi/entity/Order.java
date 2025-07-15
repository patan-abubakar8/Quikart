package com.ecommerce.ecomapi.entity;

import com.ecommerce.ecomapi.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    private BigDecimal totalAmount;

    private String shippingAddress;

    private LocalDateTime orderDate = LocalDateTime.now();

    private LocalDateTime updatedDate;

    @PreUpdate
    public void preUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}