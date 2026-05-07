# API Reference

---

## Overview

The backend provides two groups of endpoints: log entry CRUD and SHIT Points claim relay. All log data is stored in a server-local database. Points computation happens on the frontend; the backend only handles the claim relay to the external points module.

Base URLs:

- Development: `http://localhost:8080`
- Production: `https://oshit.io/log-log/api/v1`

---

## Log Entries

### `POST /logs`

Create a new log entry.

**Request**

```json
{
  "shape": "ShapeType",
  "color": "ColorType | null",
  "feeling": "FeelingType | null",
  "contributingFactors": ["string"] | null,
  "location": "LocationType | null"
}
```

**Response** `201 Created`

```json
{
  "id": "string",
  "userId": "string",
  "timestamp": "ISO 8601",
  "shape": "ShapeType",
  "color": "ColorType | null",
  "feeling": "FeelingType | null",
  "contributingFactors": ["string"] | null,
  "location": "LocationType | null"
}
```

---

### `GET /logs`

Fetch log entries for the current user within a date range.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | ISO 8601 date | Yes | Start date (inclusive) |
| `to` | ISO 8601 date | Yes | End date (inclusive) |

**Response** `200 OK`

```json
[
  {
    "id": "string",
    "userId": "string",
    "timestamp": "ISO 8601",
    "shape": "ShapeType",
    "color": "ColorType | null",
    "feeling": "FeelingType | null",
    "contributingFactors": ["string"] | null,
    "location": "LocationType | null"
  }
]
```

**Usage by page:**
- **Home (calendar):** fetch current month's entries
- **Dashboard:** fetch entries for current week (Monday-Sunday) and current month
- **Report:** fetch entries for the target week (Monday-Sunday)

---

## SHIT Points

### `POST /points/claim`

Claim accumulated SHIT Points. The backend validates and relays the request to the external points module.

**Request**

```json
{
  "userId": "string",
  "points": "number"
}
```

**Response** `200 OK`

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
- The backend is responsible for validating the claim before relaying to the external module.
- The frontend awaits the response and shows success/failure feedback to the user.

---

## Enums

### ShapeType

```
rabbit_pellets | twisted_rope | banana_bro | soft_serve | splash_zone
```

### ColorType

```
golden_standard | dark_roast | clay_warning
```

### FeelingType

```
effortless | could_have_been_more | hard_won
```

### LocationType

```
home | office | school | outdoors | car | plane | boat
```
