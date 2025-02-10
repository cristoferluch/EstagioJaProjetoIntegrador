package com.example.estagioja.estagioja.controller.job;

public record FilterJobDto(
        String titulo,
        String categories,
        String companyId,
        Integer minSalario,
        Integer maxSalario) {
}
