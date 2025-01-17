package com.example.backend.services;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private String jwtSecretKey = "4a58afe52404b0d4535d3e3344a8b90928d7afae03ccb2247a95dc5f1d684c16";

    private SecretKey getJwtKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretKey));
    }

    public String createToken(String username) {
        long expirationTimeMillis = 1000 * 60;
        return Jwts.builder().issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()
                + expirationTimeMillis)).subject(username).signWith(getJwtKey(), Jwts.SIG.HS256).compact();
    }

    private Jws<Claims> jwtSingedClaimsToken(String token) {
        return Jwts.parser().verifyWith(getJwtKey()).build().parseSignedClaims(token);
    }

    public String getUsernameByToken(String token) {
        return jwtSingedClaimsToken(token).getPayload().getSubject();
    }

}
