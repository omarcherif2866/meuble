package com.example.meublebackend.service;

import com.example.meublebackend.entity.Category;

import java.util.List;

public interface CategoryService {


    Category create(Category category);

    Category update(Long id, Category category);

    Category getById(Long id);

    List<Category> getAll();

    void delete(Long id);
}
