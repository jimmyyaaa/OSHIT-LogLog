package com.loglog.backend.token;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;

@Component
public class TokenApiClient {

    @Value("${token.api.url}")
    private String tokenApiUrl;

    @Value("${token.api.key}")
    private String tokenApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendReward(String userId, RewardAction action) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + tokenApiKey);

        Map<String, Object> body = Map.of(
            "userId", userId,
            "action", action.name()
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        restTemplate.postForEntity(tokenApiUrl, request, Void.class);
    }
}
