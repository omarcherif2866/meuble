package com.example.meublebackend.controller;

import com.example.meublebackend.entity.Category;
import com.example.meublebackend.service.CategoryService;
import com.example.meublebackend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@RestController
@RequestMapping("/categories")
@CrossOrigin("*")
@RequiredArgsConstructor

public class CategoryController {

    private final CategoryService categoryService;
    private final CloudinaryService cloudinaryService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> add(
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            // Validation
            if (name == null || name.isEmpty()) {
                return ResponseEntity.badRequest().body("Paramètres d'entrée invalides.");
            }

            Category cat = new Category();
            cat.setName(name);



            // Upload de l'image vers Cloudinary
            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image);
                cat.setImage(imageUrl);
            }

            Category savedCategory = categoryService.create(cat);

            return ResponseEntity.ok(savedCategory);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload de l'image : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur s'est produite lors du traitement de la demande : " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            Category existing = categoryService.getById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Categorie non trouvée");
            }

            // MAJ des champs
            existing.setName(name);


            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image);
                existing.setImage(imageUrl);
            }

            Category saved = categoryService.update(id, existing);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload de l'image : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
