package com.example.demo.dto;

import lombok.Data;

@Data // Lombok va a generar los getters y setters automaticamente
public class AuthRequest {
    private String username;
    private String password;
}