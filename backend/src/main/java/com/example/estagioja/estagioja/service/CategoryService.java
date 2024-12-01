package com.example.estagioja.estagioja.service;

import com.example.estagioja.estagioja.controller.category.CreateCategoryDto;
import com.example.estagioja.estagioja.entity.Category;
import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.exception.CategoryException;
import com.example.estagioja.estagioja.exception.JobException;
import com.example.estagioja.estagioja.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Optional<Category> getCategoryById(String categoryId) throws CategoryException {
        return Optional.ofNullable(this.categoryRepository.findById(UUID.fromString(categoryId)).orElseThrow(() -> new CategoryException("Categoria não encontrado: " + categoryId)));
    }

    public List<Category> listCategories() {
        return this.categoryRepository.findAll();
    }

    @Transactional
    public Category createCategory(CreateCategoryDto createCategoryDto) throws CategoryException {
        Category entity = buildCategoryEntity(createCategoryDto);
        Category saved = this.categoryRepository.save(entity);
        return saved;
    }

    private Category buildCategoryEntity(CreateCategoryDto createCategoryDto) throws CategoryException {
        Instant now = Instant.now();

        return Category.builder()
                .id(UUID.randomUUID())
                .titulo(createCategoryDto.titulo())
                .dataInclusao(now)
                .build();
    }
}
