package com.ecommerce.ecomapi.service.cart;

import com.ecommerce.ecomapi.entity.Cart;
import com.ecommerce.ecomapi.entity.CartItem;
import com.ecommerce.ecomapi.entity.Product;
import com.ecommerce.ecomapi.entity.User;
import com.ecommerce.ecomapi.exceptions.ResourceNotFoundException;
import com.ecommerce.ecomapi.repository.CartItemRepository;
import com.ecommerce.ecomapi.repository.CartRepository;
import com.ecommerce.ecomapi.repository.ProductRepository;
import com.ecommerce.ecomapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService{

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    @Override
    public Cart getCartByUserId(Long userId) {
        User user =userRepo.findById(userId)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));
        return cartRepo.findByUser(user).orElseGet(()->{
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setItems(new ArrayList<>());
            newCart.setTotalAmount(BigDecimal.ZERO);
            return cartRepo.save(newCart);
        });
    }

    @Override
    public Cart addItemToCart(Long userId, Long productId, int quantity) {
        User user = userRepo.findById(userId)
                .orElseThrow(()->new ResourceNotFoundException("User not Found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(()->new ResourceNotFoundException("Product not Found"));

        Cart cart =getCartByUserId(userId);

        CartItem item =new CartItem();
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        item.setCart(cart);
        cartItemRepo.save(item);

        List<CartItem> items =cart.getItems();
        items.add(item);
        cart.setItems(items);

        BigDecimal totalAmount = items.stream()
                .map(CartItem::getTotalPrice).
                reduce(BigDecimal.ZERO,BigDecimal::add);
        cart.setTotalAmount(totalAmount);

        return cartRepo.save(cart);
    }

    @Override
    public void removeItem(Long cartItemId) {
        CartItem item =cartItemRepo.findById(cartItemId)
                .orElseThrow(()->new ResourceNotFoundException("Cart item not found"));
        cartItemRepo.delete(item);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepo.save(cart);
    }
}
