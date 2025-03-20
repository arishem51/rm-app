package com.example.backend.dto.order;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderDTO {
    private Long partnerId;
    @NotBlank(message = "Partner name is required")
    private String partnerName;
    @Pattern(regexp = "^[0-9]{10,12}$", message = "Phone number must be 10-12 digits long")
    private String partnerPhone;
    private BigDecimal amount;
    private List<OrderItemDTO> orderItems;
}
