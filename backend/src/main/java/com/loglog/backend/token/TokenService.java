package com.loglog.backend.token;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);

    // TODO: replace with real TokenApiClient when external token service is ready
    public void reward(String userId, RewardAction action) {
        try {
            Thread.sleep(1000);
            log.info("[MOCK] Token reward dispatched: userId={} action={}", userId, action);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
