package com.example.estagioja.estagioja.controller.job;

public record FilterJobDto(
        String titulo,
        String category,
        String companyId,
        Integer minSalario,
        Integer maxSalario) {
}
