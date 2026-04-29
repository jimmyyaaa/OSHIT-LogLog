package com.oshit.loglog.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oshit.loglog.model.ClaimPointsRequest;
import com.oshit.loglog.points.PointsClaimService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/points")
public class PointsController {

    private final PointsClaimService pointsClaimService;

    public PointsController(PointsClaimService pointsClaimService) {
        this.pointsClaimService = pointsClaimService;
    }

    @PostMapping("/claim")
    public ResponseEntity<Map<String, Object>> claim(@Valid @RequestBody ClaimPointsRequest request) {
        Map<String, Object> result = pointsClaimService.claimPoints(request.userId(), request.points());
        return ResponseEntity.ok(result);
    }
}
