package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    // Clave secreta para firmar el token
    private final String SECRET_KEY = "EstaEsUnaClaveSecretaSuperSeguraParaNuestraAppITOps";

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Metodo para generar el token a partir del nombre de usuario
    public String generarToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Dura 10 horas el token
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Metodos para validar y leer los token recibidos
    public String extraerUsername(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    public boolean validarToken(String token, String username) {
        final String tokenUsername = extraerUsername(token);
        return (tokenUsername.equals(username) && !isTokenExpirado(token));
    }

    private boolean isTokenExpirado(String token) {
        return extraerClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extraerClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
        return claimsResolver.apply(claims);
    }
}