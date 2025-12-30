package com.example.meublebackend.service;

import com.example.meublebackend.entity.Order;
import com.example.meublebackend.entity.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {

    Order createOrder(Order order);

    Order getOrderById(Long id);

    Order getOrderByOrderNumber(String orderNumber);

    List<Order> getAllOrders();

    List<Order> getOrdersByUserId(Long userId);

    List<Order> getOrdersByStatus(OrderStatus status);

    List<Order> getOrdersByUserIdAndStatus(Long userId, OrderStatus status);

    List<Order> getOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    List<Order> getRecentOrders(int days);

    Order updateOrder(Long id, Order order);

    Order updateOrderStatus(Long id, OrderStatus status);

    void deleteOrder(Long id);

    long countOrdersByUserId(Long userId);

    long countOrdersByStatus(OrderStatus status);

    String generateOrderNumber();
}