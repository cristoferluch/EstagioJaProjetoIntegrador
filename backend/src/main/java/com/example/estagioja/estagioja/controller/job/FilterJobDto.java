package com.example.estagioja.estagioja.controller.job;

public record FilterJobDto(
        String titulo,
        String category,
        int minSalario,
        int maxSalario) {
}
