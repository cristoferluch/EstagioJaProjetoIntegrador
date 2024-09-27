package com.example.estagioja.estagioja.controller;

public record CreateUserDto(String nome, String sobrenome, String email, String celular, String cpf, String senha, String uf, String municipio, String endereco, String bairro, int numero, String genero, String dataNascimento) {


}
