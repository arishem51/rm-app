package com.example.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
        @Bean
        public OpenAPI openAPI() {
                return new OpenAPI()
                                .info(new Info().title("API Documentation").version("1.0"))
                                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                                .components(new io.swagger.v3.oas.models.Components()
                                                .addSecuritySchemes("Bearer Authentication",
                                                                new SecurityScheme()
                                                                                .name("Authorization")
                                                                                .type(SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")));
        }
}
