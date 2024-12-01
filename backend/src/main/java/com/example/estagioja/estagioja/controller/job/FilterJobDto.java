package com.example.estagioja.estagioja.controller.job;

public record FilterJobDto(
        String titulo,
        String category,
        String companyId,
        int minSalario,
        int maxSalario) {
}
