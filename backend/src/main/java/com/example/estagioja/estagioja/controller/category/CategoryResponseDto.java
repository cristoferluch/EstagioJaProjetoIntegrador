package com.example.estagioja.estagioja.controller.category;

import java.util.UUID;

public record CategoryResponseDto(
        UUID id,
        String titulo
) {
}