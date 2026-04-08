# API Reference

---

## Overview

In MVP, all log data is stored in localStorage and all computation happens on the frontend. The backend exposes one endpoint: token reward relay.

---

## Token Relay

### `POST /api/token/reward`

Called by the frontend after a reward-eligible action is completed. The backend validates the action and forwards the reward request to the external token API.

**Request**

```json
{
  "userId": "string",
  "action": "RewardAction"
}
```

**RewardAction**

```typescript
type RewardAction =
  | 'daily_log'              // +1 SHIT
  | 'streak_3'               // +3 SHIT
  | 'streak_7'               // +7 SHIT
  | 'streak_30'              // +30 SHIT
  | 'first_ideal_shape'      // +5 SHIT
  | 'week_complete'          // +10 SHIT
  | 'first_report_shared'    // +15 SHIT
```

**Response**

```json
{
  "success": true
}
```

**Error**

```json
{
  "success": false,
  "error": "string"
}
```

**Notes**
- `userId` is provided by the parent platform's auth context.
- The backend is responsible for deduplication (e.g. `first_ideal_shape` should only reward once per user).
- The frontend **awaits** the response before showing the reward toast. The user sees a loading state during the request and a token notification once `success: true` is returned.
- The frontend does not display token balance — it only shows a transient earned-reward toast (e.g. "🪙 +1 SHIT 已到账").

---

## Future Endpoints (post-MVP)

When data migrates from localStorage to a database, the following endpoints will be added:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/log` | Submit a new log entry |
| `GET` | `/api/log` | Fetch all entries for the current user |
| `GET` | `/api/dashboard` | Fetch computed dashboard metrics |
