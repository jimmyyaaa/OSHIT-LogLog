package com.loglog.backend.controller;

import com.loglog.backend.token.RewardRequest;
import com.loglog.backend.token.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/token")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/reward")
    public ResponseEntity<Map<String, Boolean>> reward(@RequestBody RewardRequest request) {
        tokenService.reward(request.getUserId(), request.getAction());
        return ResponseEntity.ok(Map.of("success", true));
    }
}
