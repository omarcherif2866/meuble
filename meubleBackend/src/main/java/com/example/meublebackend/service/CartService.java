package com.example.meublebackend.service;

import com.example.meublebackend.entity.Order;

public interface CartService {
    Order addToCart(Long userId, Long productId, Integer quantity);
    Order getCart(Long userId);
    Order getOrCreateCart(Long userId);
    Order updateCartItemQuantity(Long userId, Long productId, Integer quantity);
    Order removeFromCart(Long userId, Long productId);
    void clearCart(Long userId);
}