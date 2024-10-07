package com.example.estagioja.estagioja.controller.company;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record UpdateCompanyDto(
        @NotBlank String celular,
        @NotBlank String senha,
        @NotBlank String cep,
        @NotBlank String uf,
        @NotBlank String municipio,
        @NotBlank String endereco,
        @NotBlank String bairro,
        @Positive int numero){
}
