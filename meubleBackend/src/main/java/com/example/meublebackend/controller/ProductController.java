package com.example.meublebackend.controller;


import com.example.meublebackend.entity.Category;
import com.example.meublebackend.entity.Product;
import com.example.meublebackend.service.CategoryService;
import com.example.meublebackend.service.CloudinaryService;
import com.example.meublebackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
@RequiredArgsConstructor

public class ProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;
    private final CategoryService categoryService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("description") String description,
            @RequestParam("nouveautes") Boolean nouveautes,
            @RequestParam("remise") Boolean remise) {

        try {
            // Validation basique
            if (name == null || name.isEmpty() || price == null || categoryId == null) {
                return ResponseEntity.badRequest().body("Paramètres d'entrée invalides.");
            }

            Product product = new Product();
            product.setName(name);
            product.setPrice(price);
            product.setDescription(description);
            product.setNouveautes(nouveautes);
            product.setRemise(remise);

            // Récupérer la catégorie
            Category category = categoryService.getById(categoryId);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Categorie non trouvée");
            }
            product.setCategory(category);

            // Upload des images vers Cloudinary
            if (images != null && images.length > 0) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : images) {
                    if (!file.isEmpty()) {
                        String url = cloudinaryService.uploadImage(file);
                        imageUrls.add(url);
                    }
                }
                product.setImages(imageUrls);
            }

            Product savedProduct = productService.create(product);
            return ResponseEntity.ok(savedProduct);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload des images : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("description") String description,
            @RequestParam("nouveautes") Boolean nouveautes,
            @RequestParam("remise") Boolean remise) {

        try {
            Product existing = productService.getById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produit non trouvé");
            }

            existing.setName(name);
            existing.setPrice(price);
            existing.setDescription(description);
            existing.setNouveautes(nouveautes);
            existing.setRemise(remise);

            // Récupérer la catégorie
            Category category = categoryService.getById(categoryId);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Categorie non trouvée");
            }
            existing.setCategory(category);

            // Upload des nouvelles images si fournies
            if (images != null && images.length > 0) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : images) {
                    if (!file.isEmpty()) {
                        String url = cloudinaryService.uploadImage(file);
                        imageUrls.add(url);
                    }
                }
                existing.setImages(imageUrls);
            }

            Product saved = productService.update(id, existing);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload des images : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur serveur : " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Long categoryId) {
        return productService.getByCategory(categoryId);
    }

    @GetMapping("/nouveautes")
    public ResponseEntity<List<Product>> getNouveautes() {
        List<Product> nouveautes = productService.getNouveautes();
        return ResponseEntity.ok(nouveautes);
    }

    @GetMapping("/nouveautes/category/{categoryId}")
    public ResponseEntity<List<Product>> getNouveautesByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getNouveautesByCategory(categoryId);
        return ResponseEntity.ok(products);
    }
}