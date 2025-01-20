package com.example.estagioja.estagioja.controller.job;

import com.example.estagioja.estagioja.controller.category.CategoryResponseDto;
import com.example.estagioja.estagioja.controller.company.CompanyResponseDto;

import java.util.UUID;

public record JobResponseDto(
        UUID id,
        String titulo,
        String descricao,
        Integer salario,
        CompanyResponseDto company,
        CategoryResponseDto category
) {
}