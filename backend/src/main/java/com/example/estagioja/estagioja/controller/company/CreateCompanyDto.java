package com.example.estagioja.estagioja.controller.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateCompanyDto(
        @NotBlank String nome,
        @Email @NotBlank String email,
        @NotBlank String celular,
        @NotBlank String cnpj,
        @NotBlank String senha,
        @NotBlank String uf,
        @NotBlank String cep,
        @NotBlank String municipio,
        @NotBlank String endereco,
        @NotBlank String bairro,
        @Positive int numero) {
}
