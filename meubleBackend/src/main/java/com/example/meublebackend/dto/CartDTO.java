package com.example.meublebackend.dto;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDTO {
    @Builder.Default
    private List<CartItemDTO> items = new ArrayList<>();
}