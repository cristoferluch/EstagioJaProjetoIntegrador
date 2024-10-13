package com.example.estagioja.estagioja.controller.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record UserResponseDto(
        String nome,
        String sobrenome,
        String email,
        String celular,
        String cpf,
        String uf,
        String cep,
        String municipio,
        String endereco,
        String bairro,
        int numero,
        String genero,
        LocalDate dataNascimento) {
}
