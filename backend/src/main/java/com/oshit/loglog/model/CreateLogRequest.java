package com.oshit.loglog.model;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record CreateLogRequest(
        @NotBlank String shape,
        String color,
        String feeling,
        List<String> contributingFactors,
        String location
) {
}
