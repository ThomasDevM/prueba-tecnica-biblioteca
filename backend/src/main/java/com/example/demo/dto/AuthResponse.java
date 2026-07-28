package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Esto va a generar un constructor para pasarle el token fácilmente
public class AuthResponse {
    private String token;
}