package com.example.estagioja.estagioja.controller.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateJobDto(
        @NotBlank String titulo,
        @NotBlank String descricao,
        @NotBlank String category,
        @Positive int salario,
        @NotBlank String companyId) {
}
