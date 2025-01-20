package com.example.estagioja.estagioja.controller.category;

import com.example.estagioja.estagioja.entity.Category;
import com.example.estagioja.estagioja.exception.CategoryException;
import com.example.estagioja.estagioja.exception.ErrorResponse;
import com.example.estagioja.estagioja.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> listCategories() {
        var categories = this.categoryService.listCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) throws CategoryException {
        var category = this.categoryService.getCategoryById(id)
                .orElseThrow(() -> new CategoryException("Categoria não encontrada: " + id));
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @RequestBody CreateCategoryDto createCategoryDto) throws CategoryException {
        if (createCategoryDto.titulo() == null || createCategoryDto.titulo().trim().isEmpty()) {
            ErrorResponse errorResponse = new ErrorResponse(400, "O nome da categoria não pode ser vazio");
            return ResponseEntity.status(400).body(errorResponse);
        }
        var updatedCategory = this.categoryService.updateCategory(id, createCategoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CreateCategoryDto createCategoryDto) {

        if (createCategoryDto.titulo() == null || createCategoryDto.titulo().trim().isEmpty()) {
            ErrorResponse errorResponse = new ErrorResponse(400, "O nome da categoria não pode ser vazio");
            return ResponseEntity.status(400).body(errorResponse);
        }

        try {
            Category category = categoryService.createCategory(createCategoryDto);
            return ResponseEntity.status(201).body(category);
        } catch (CategoryException e) {
            ErrorResponse errorResponse = new ErrorResponse(409, e.getMessage());
            return ResponseEntity.status(409).body(errorResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(500, "Erro ao criar categoria");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ErrorResponse> deleteCategory(@PathVariable UUID categoryId) {
        try {
            categoryService.deleteCategoryById(categoryId);
            ErrorResponse successResponse = new ErrorResponse(200, "Categoria excluída com sucesso");
            return ResponseEntity.ok(successResponse);
        } catch (CategoryException e) {
            ErrorResponse errorResponse = new ErrorResponse(409, e.getMessage());
            return ResponseEntity.status(409).body(errorResponse);
        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse(404, "Categoria não encontrada");
            return ResponseEntity.status(404).body(errorResponse);
        }
    }

}
