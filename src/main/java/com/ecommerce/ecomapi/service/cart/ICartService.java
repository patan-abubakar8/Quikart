package com.ecommerce.ecomapi.service.cart;

import com.ecommerce.ecomapi.entity.Cart;

public interface ICartService {
    Cart getCartByUserId(Long userId);
    Cart addItemToCart(Long userId, Long productId, int quantity);
    void removeItem(Long cartItemId);
    void clearCart(Long userId);
}
