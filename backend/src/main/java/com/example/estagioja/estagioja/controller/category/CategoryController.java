package com.example.estagioja.estagioja.controller.category;

import com.example.estagioja.estagioja.entity.Category;
import com.example.estagioja.estagioja.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

}
