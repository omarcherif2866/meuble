package com.example.meublebackend.serviceImp;

import com.example.meublebackend.entity.Category;
import com.example.meublebackend.entity.Product;
import com.example.meublebackend.repository.CategoryRepository;
import com.example.meublebackend.repository.ProductRepository;
import com.example.meublebackend.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProductServiceImp implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;



    @Override
    public Product create(Product product) {
        if (product.getCategory() != null) {
            Category category = categoryRepository.findById(
                    product.getCategory().getId()
            ).orElseThrow(() -> new EntityNotFoundException("Category not found"));

            product.setCategory(category);
        }
        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        Product existing = getById(id);

        existing.setName(product.getName());
        existing.setPrice(product.getPrice());
        existing.setImages(product.getImages());
        existing.setDescription(product.getDescription());
        existing.setNouveautes(product.getNouveautes());
        existing.setRemise(product.getRemise());

        if (product.getCategory() != null) {
            Category category = categoryRepository.findById(
                    product.getCategory().getId()
            ).orElseThrow(() -> new EntityNotFoundException("Category not found"));
            existing.setCategory(category);
        }

        return productRepository.save(existing);
    }

    @Override
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }

    @Override
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getNouveautes() {
        return productRepository.findByNouveautesTrue();
    }

    public List<Product> getNouveautesByCategory(Long categoryId) {
        return productRepository.findByNouveautesTrueAndCategoryId(categoryId);
    }

}
