package com.example.backend.services;

import java.time.Duration;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    // FIXME: should be env
    private String jwtSecretKey = "4a58afe52404b0d4535d3e3344a8b90928d7afae03ccb2247a95dc5f1d684c16";

    private SecretKey getJwtKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecretKey));
    }

    private long getMilliseconds(long amount, String unit) {
        switch (unit.toLowerCase()) {
            case "seconds":
                return Duration.ofSeconds(amount).toMillis();
            case "minutes":
                return Duration.ofMinutes(amount).toMillis();
            case "hours":
                return Duration.ofHours(amount).toMillis();
            case "days":
                return Duration.ofDays(amount).toMillis();
            default:
                throw new IllegalArgumentException("Invalid time unit: " + unit);
        }
    }

    public String createToken(String username) {
        long expirationTimeMillis = getMilliseconds(100000, "seconds");
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
