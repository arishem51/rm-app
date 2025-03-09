package com.example.backend.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReCaptchaToken {
    @Value("${spring.recaptcha.secret}")
    private String secretKey;

    private final WebClient.Builder webClientBuilder;

    public boolean verifyToken(String token) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString("https://www.google.com/recaptcha/api/siteverify")
                .queryParam("secret", secretKey)
                .queryParam("response", token);
        Map<String, Object> response = webClientBuilder.build()
                .post()
                .uri(builder.toUriString())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return (boolean) response.get("success");
    }

}
