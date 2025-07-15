package com.ecommerce.ecomapi.controller;

import com.ecommerce.ecomapi.entity.Cart;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.response.ApiResponse;
import com.ecommerce.ecomapi.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final ICartService cartService;

    @GetMapping("/cart-details/{userId}")
    public ResponseEntity<ApiResponse<Cart>> getUserCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(new ApiResponse<>("Cart fetched", cart));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/{userId}/add-to-cart/{productId}")
    public ResponseEntity<ApiResponse<Cart>> addItemToCart(@PathVariable Long userId, @PathVariable Long productId, @RequestParam(defaultValue = "1") int quantity) {
        try {
            Cart cart = cartService.addItemToCart(userId, productId, quantity);
            return ResponseEntity.ok(new ApiResponse<>("Item added to cart", cart));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("/remove-item/{itemId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(@PathVariable Long itemId) {
        try {
            cartService.removeItem(itemId);
            return ResponseEntity.ok(new ApiResponse<>("Item removed from cart", null));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(),null));
        }
    }

    @DeleteMapping("/{userId}/clear-cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok(new ApiResponse<>("Cart cleared", null));
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse<>(e.getMessage(), null));
        }
    }


}
