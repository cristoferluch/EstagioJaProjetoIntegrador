package com.example.estagioja.estagioja.controller;

import java.time.Instant;
import java.util.UUID;

public record UpdateUserDto(String email, String celular, String senha, String uf,String municipio, String endereco, String bairro, String numero) {

}
