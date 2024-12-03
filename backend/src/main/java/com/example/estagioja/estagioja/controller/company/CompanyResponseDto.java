package com.example.estagioja.estagioja.controller.company;

import java.util.UUID;

public record CompanyResponseDto(
        UUID id,
        String nome,
        String email,
        String celular,
        String cnpj,
        String senha,
        String uf,
        String cep,
        String municipio,
        String endereco,
        String bairro,
        int numero) {
}
