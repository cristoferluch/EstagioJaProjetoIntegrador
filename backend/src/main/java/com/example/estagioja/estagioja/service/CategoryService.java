package com.example.estagioja.estagioja.service;

import com.example.estagioja.estagioja.controller.category.CreateCategoryDto;
import com.example.estagioja.estagioja.entity.Category;
import com.example.estagioja.estagioja.entity.Job;
import com.example.estagioja.estagioja.exception.CategoryException;
import com.example.estagioja.estagioja.exception.ErrorResponse;
import com.example.estagioja.estagioja.exception.JobException;
import com.example.estagioja.estagioja.repository.CategoryRepository;
import com.example.estagioja.estagioja.repository.JobRepository;
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

    @Autowired
    private JobRepository jobRepository;

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

    @Transactional
    public Category updateCategory(String categoryId, CreateCategoryDto createCategoryDto) throws CategoryException {
        Category category = getCategoryById(categoryId)
                .orElseThrow(() -> new CategoryException("Categoria não encontrada: " + categoryId));
        category.setTitulo(createCategoryDto.titulo());
        return this.categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategoryById(UUID categoryId) throws CategoryException {
        if (jobRepository.existsByCategoryId(categoryId)) {
            throw new CategoryException("A categoria está associada a uma vaga e não pode ser excluída");
        }

        if (categoryRepository.existsById(categoryId)) {
            categoryRepository.deleteById(categoryId);
        } else {
            throw new CategoryException("Categoria não encontrada para exclusão");
        }
    }


}
