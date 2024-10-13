package com.example.estagioja.estagioja.controller.user;

import java.util.UUID;

public record LoginResponseDto(String token, UUID id) {
}
