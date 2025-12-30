package com.example.meublebackend.entity;

public enum OrderStatus {
    PENDING,      // En attente
    CONFIRMED,    // Confirmée
    PROCESSING,   // En traitement
    SHIPPED,      // Expédiée
    DELIVERED,    // Livrée
    CANCELLED     // Annulée
}