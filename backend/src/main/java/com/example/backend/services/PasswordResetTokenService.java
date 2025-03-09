package com.example.backend.services;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.backend.entities.PasswordResetToken;
import com.example.backend.repositories.PasswordResetTokenRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Transactional
    public void deleteToken(String email) {
        passwordResetTokenRepository.deleteByEmail(email);
    }

    @Transactional
    public String createToken(String email) {
        this.deleteToken(email);
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setEmail(email);
        resetToken.setToken(token);
        resetToken.setExpiryTime(expiryTime);

        passwordResetTokenRepository.save(resetToken);
        return token;
    }

    public PasswordResetToken verify(String token) {
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            throw new IllegalArgumentException("Invalid token!");
        }
        PasswordResetToken resetToken = optionalToken.get();
        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expired!");
        }
        return resetToken;
    }

}
