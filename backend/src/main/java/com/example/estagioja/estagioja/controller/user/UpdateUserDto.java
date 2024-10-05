package com.example.estagioja.estagioja.controller.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateUserDto(
    @NotBlank String celular,
    @NotBlank String senha,
    @NotBlank String uf,
    @NotBlank String municipio,
    @NotBlank String endereco,
    @NotBlank String bairro,
    @Positive int numero){
}
