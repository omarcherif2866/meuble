package com.example.meublebackend.controller;

import com.example.meublebackend.dto.CartDTO;
import com.example.meublebackend.dto.CartItemDTO;
import com.example.meublebackend.entity.Order;
import com.example.meublebackend.entity.OrderItem;
import com.example.meublebackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartDTO> getCart(@PathVariable Long userId) {
        try {
            Order cart = cartService.getOrCreateCart(userId);

            CartDTO cartDTO = CartDTO.builder()
                    .items(cart.getOrderItems().stream()
                            .map(this::convertToDTO)
                            .collect(Collectors.toList()))
                    .build();

            return ResponseEntity.ok(cartDTO);
        } catch (Exception e) {
            return ResponseEntity.ok(CartDTO.builder().build());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {

        Map<String, Object> response = new HashMap<>();

        try {
            Order cart = cartService.addToCart(userId, productId, quantity);
            response.put("success", true);
            response.put("message", "Produit ajouté au panier");
            response.put("cartItemsCount", cart.getOrderItems().size());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        Map<String, Object> response = new HashMap<>();

        try {
            cartService.updateCartItemQuantity(userId, productId, quantity);
            response.put("success", true);
            response.put("message", "Quantité mise à jour");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long productId) {

        Map<String, Object> response = new HashMap<>();

        try {
            cartService.removeFromCart(userId, productId);
            response.put("success", true);
            response.put("message", "Produit retiré du panier");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<Map<String, Object>> clearCart(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            cartService.clearCart(userId);
            response.put("success", true);
            response.put("message", "Panier vidé");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    private CartItemDTO convertToDTO(OrderItem orderItem) {
        List<String> images = orderItem.getProduct().getImages();
        String firstImage = (images != null && !images.isEmpty()) ? images.get(0) : null;

        return CartItemDTO.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProduct().getId())
                .productName(orderItem.getProduct().getName())
                .price(orderItem.getUnitPrice())
                .quantity(orderItem.getQuantity())
                .image(firstImage)
                .category(orderItem.getProduct().getCategory() != null ?
                        orderItem.getProduct().getCategory().getName() : null)
                .description(orderItem.getProduct().getDescription())
                .build();
    }

}