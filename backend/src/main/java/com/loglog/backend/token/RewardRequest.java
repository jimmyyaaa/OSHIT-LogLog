package com.loglog.backend.token;

public class RewardRequest {
    private String userId;
    private RewardAction action;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public RewardAction getAction() { return action; }
    public void setAction(RewardAction action) { this.action = action; }
}
