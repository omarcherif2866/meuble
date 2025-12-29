package com.example.meublebackend.serviceImp;

import com.example.meublebackend.entity.Category;
import com.example.meublebackend.repository.CategoryRepository;
import com.example.meublebackend.service.CategoryService;
import com.example.meublebackend.service.CloudinaryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryServiceImp implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;


    @Override
    public Category create(Category Categorys) {
        try {
            return categoryRepository.save(Categorys);
        } catch (DataIntegrityViolationException e) {
            // Gérer l'erreur de clé dupliquée ici
            throw new IllegalArgumentException("Erreur lors de l'ajout de la categorie : Cette categorie existe déjà.");
        } catch (Exception e) {
            // Gérer les autres exceptions ici
            throw new RuntimeException("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }

    @Override
    public Category update(Long id, Category Category) {
        try {
            Category existingCategory = categoryRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));

            if (Category.getName() != null) {
                existingCategory.setName(Category.getName());
            }
            if (Category.getImage() != null) {
                existingCategory.setImage(Category.getImage());
            }




            Category updatedCategory = categoryRepository.save(existingCategory);

            return updatedCategory;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Category not found with ID: " + id);
        }
    }

    @Override
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
    }

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
