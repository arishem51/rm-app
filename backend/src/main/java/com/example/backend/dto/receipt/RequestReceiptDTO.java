package com.example.backend.dto.receipt;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestReceiptDTO {

    @NotNull(message = "Shop ID is required!")
    private Long shopId;
    
    private Long partnerId;

    @NotBlank(message = "Partner name is required!")
    private String partnerName;

    @NotBlank(message = "Created by is required!")
    private String createdBy;

    @NotEmpty(message = "Product list cannot be empty!")
    private List<String> products;
}
