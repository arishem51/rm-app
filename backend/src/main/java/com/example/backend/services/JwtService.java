package com.example.backend.services;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private String jwtSecretKey = "4a58afe52404b0d4535d3e3344a8b90928d7afae03ccb2247a95dc5f1d684c16";

    private SecretKey getJwtKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretKey));
    }

    public String createToken(String username) {
        return Jwts.builder().subject(username).signWith(getJwtKey(), Jwts.SIG.HS256).compact();
    }
}
