package com.loglog.backend.token;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);

    private final TokenApiClient tokenApiClient;

    public TokenService(TokenApiClient tokenApiClient) {
        this.tokenApiClient = tokenApiClient;
    }

    public void reward(String userId, RewardAction action) {
        try {
            tokenApiClient.sendReward(userId, action);
            log.info("Token reward dispatched: userId={} action={}", userId, action);
        } catch (Exception e) {
            // Non-blocking: log and continue. Token failure must not affect user flow.
            log.error("Token reward failed: userId={} action={} error={}", userId, action, e.getMessage());
        }
    }
}
