package com.oshit.loglog.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ClaimPointsRequest(
        @NotBlank String userId,
        @Min(0) int points
) {
}
