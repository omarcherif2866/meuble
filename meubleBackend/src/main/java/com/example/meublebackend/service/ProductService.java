package com.example.meublebackend.service;

import com.example.meublebackend.entity.Product;

import java.util.List;

public interface ProductService {
    Product create(Product product);

    Product update(Long id, Product product);

    Product getById(Long id);

    List<Product> getAll();

    void delete(Long id);

    List<Product> getByCategory(Long categoryId); // <-- nouveau

    List<Product> getNouveautes(); // <-- nouveau

    List<Product> getNouveautesByCategory(Long categoryId);


}
