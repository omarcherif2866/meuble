package com.example.meublebackend.repository;


import com.example.meublebackend.entity.Order;
import com.example.meublebackend.entity.OrderStatus;
import com.example.meublebackend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Trouver toutes les commandes d'un utilisateur
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    // Trouver toutes les commandes d'un utilisateur par son ID
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Trouver une commande par son numéro
    Optional<Order> findByOrderNumber(String orderNumber);

    // Trouver les commandes par statut
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    // Trouver les commandes d'un utilisateur par statut
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    // Trouver les commandes entre deux dates
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);



    // Vérifier si un numéro de commande existe déjà
    boolean existsByOrderNumber(String orderNumber);

    // Compter les commandes d'un utilisateur
    long countByUserId(Long userId);

    // Compter les commandes par statut
    long countByStatus(OrderStatus status);

    // Trouver les commandes récentes (dernières 30 jours)
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :date ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(@Param("date") LocalDateTime date);
}