package com.example.estagioja.estagioja.controller.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record CreateUserDto(
        @NotBlank String nome,
        @NotBlank String sobrenome,
        @Email @NotBlank String email,
        @NotBlank String celular,
        @NotBlank String cpf,
        @NotBlank String senha,
        @NotBlank String uf,
        @NotBlank String cep,
        @NotBlank String municipio,
        @NotBlank String endereco,
        @NotBlank String bairro,
        @Positive int numero,
        @NotBlank String genero,
        @NotBlank LocalDate dataNascimento) {
}
