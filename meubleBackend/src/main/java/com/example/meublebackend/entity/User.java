package com.example.meublebackend.entity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String email;
    private String image;

    private boolean blocked = false; // Ajout de la propriété de blocage

    @Enumerated(EnumType.STRING)
    Role role ;
    private String password;


}
