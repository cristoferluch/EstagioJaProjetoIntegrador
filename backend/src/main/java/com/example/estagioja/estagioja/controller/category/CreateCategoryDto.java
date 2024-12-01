package com.example.estagioja.estagioja.controller.category;

import jakarta.validation.constraints.NotBlank;

public record CreateCategoryDto(
        @NotBlank String titulo) {
}
