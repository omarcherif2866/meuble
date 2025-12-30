package com.example.meublebackend.serviceImp;

import com.example.meublebackend.entity.Order;
import com.example.meublebackend.entity.OrderItem;
import com.example.meublebackend.entity.OrderStatus;
import com.example.meublebackend.entity.Product;
import com.example.meublebackend.entity.User;
import com.example.meublebackend.repository.OrderRepository;
import com.example.meublebackend.repository.ProductRepository;
import com.example.meublebackend.repository.UserRepository;
import com.example.meublebackend.service.CartService;
import com.example.meublebackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImp implements CartService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderService orderService;

    @Override
    public Order addToCart(Long userId, Long productId, Integer quantity) {
        // Récupérer l'utilisateur
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));

        // Récupérer le produit
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID: " + productId));

        // Vérifier le stock
        if (product.getQuantite() < quantity) {
            throw new RuntimeException("Stock insuffisant pour le produit: " + product.getName());
        }

        // Chercher un panier existant (commande en attente)
        Order cart = getOrCreateCart(userId);

        // Vérifier si le produit existe déjà dans le panier
        OrderItem existingItem = cart.getOrderItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Mettre à jour la quantité
            int newQuantity = existingItem.getQuantity() + quantity;

            if (product.getQuantite() < newQuantity) {
                throw new RuntimeException("Stock insuffisant pour le produit: " + product.getName());
            }

            existingItem.setQuantity(newQuantity);
            existingItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
        } else {
            // Créer un nouveau OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(product.getPrice())
                    .subtotal(product.getPrice().multiply(BigDecimal.valueOf(quantity)))
                    .build();

            cart.addOrderItem(orderItem);
        }

        // Recalculer le total
        recalculateTotal(cart);

        return orderRepository.save(cart);
    }

    @Override
    public Order getCart(Long userId) {
        List<Order> pendingOrders = orderRepository.findByUserIdAndStatus(userId, OrderStatus.PENDING);
        if (pendingOrders.isEmpty()) {
            throw new RuntimeException("Panier vide");
        }
        return pendingOrders.get(0);
    }

    @Override
    public Order getOrCreateCart(Long userId) {
        List<Order> pendingOrders = orderRepository.findByUserIdAndStatus(userId, OrderStatus.PENDING);

        if (pendingOrders.isEmpty()) {
            // Créer un nouveau panier
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));

            Order cart = Order.builder()
                    .user(user)
                    .orderNumber(orderService.generateOrderNumber())
                    .status(OrderStatus.PENDING)
                    .totalAmount(BigDecimal.ZERO)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            return orderRepository.save(cart);
        }

        return pendingOrders.get(0);
    }

    @Override
    public Order updateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        Order cart = getCart(userId);

        OrderItem item = cart.getOrderItems().stream()
                .filter(orderItem -> orderItem.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Produit non trouvé dans le panier"));

        Product product = item.getProduct();

        if (product.getQuantite() < quantity) {
            throw new RuntimeException("Stock insuffisant");
        }

        item.setQuantity(quantity);
        item.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(quantity)));

        // Recalculer le total
        recalculateTotal(cart);

        return orderRepository.save(cart);
    }

    @Override
    public Order removeFromCart(Long userId, Long productId) {
        Order cart = getCart(userId);

        OrderItem item = cart.getOrderItems().stream()
                .filter(orderItem -> orderItem.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Produit non trouvé dans le panier"));

        cart.removeOrderItem(item);

        // Recalculer le total
        recalculateTotal(cart);

        return orderRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) {
        Order cart = getCart(userId);
        cart.getOrderItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cart.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(cart);
    }

    // Méthode utilitaire privée pour recalculer le total
    private void recalculateTotal(Order cart) {
        BigDecimal total = cart.getOrderItems().stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);
        cart.setUpdatedAt(LocalDateTime.now());
    }
}