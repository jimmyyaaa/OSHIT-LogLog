package com.oshit.loglog.points;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class PointsClaimService {

    /**
     * Claim SHIT Points for a user.
     * Currently a stub — always returns success.
     * TODO: Implement HTTP call to external points module.
     */
    public Map<String, Object> claimPoints(String userId, int points) {
        // Future: call external points API here
        return Map.of("success", true);
    }
}
