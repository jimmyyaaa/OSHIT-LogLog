# Data Model

---

## LogEntry

The core data unit. One entry per visit. Stored in the server-local database.

```typescript
interface LogEntry {
  id: string                        // UUID, generated server-side
  userId: string                    // From parent platform auth context
  timestamp: string                 // ISO 8601
  shape: ShapeType                  // Required
  color?: ColorType                 // Optional
  feeling?: FeelingType             // Optional
  contributingFactors?: string[]    // Optional
  location?: LocationType           // Optional
}
```

---

## ShapeType

Based on the Bristol Stool Scale, relabeled.

```typescript
type ShapeType =
  | 'rabbit_pellets'  // Type 1 — separate hard lumps
  | 'twisted_rope'    // Type 2 — lumpy sausage
  | 'banana_bro'      // Type 3 & 4 — ideal
  | 'soft_serve'      // Type 5 — soft blobs
  | 'splash_zone'     // Type 6 & 7 — loose/liquid
```

---

## ColorType

```typescript
type ColorType =
  | 'golden_standard'  // Normal, healthy
  | 'dark_roast'       // Dark brown/black
  | 'clay_warning'     // Pale/clay-colored
```

---

## FeelingType

```typescript
type FeelingType =
  | 'effortless'
  | 'could_have_been_more'
  | 'hard_won'
```

---

## LocationType

```typescript
type LocationType =
  | 'home'
  | 'office'
  | 'school'
  | 'outdoors'
  | 'car'
  | 'plane'
  | 'boat'
```

---

## Database Schema

```sql
CREATE TABLE log_entries (
  id                    TEXT PRIMARY KEY,
  user_id               TEXT NOT NULL,
  timestamp             TEXT NOT NULL,
  shape                 TEXT NOT NULL,
  color                 TEXT,
  feeling               TEXT,
  contributing_factors   TEXT,          -- JSON array, e.g. '["spicy_food","stressed"]'
  location              TEXT
);

CREATE INDEX idx_log_entries_user_time ON log_entries (user_id, timestamp);
```

---

## Derived Data

Computed at runtime on the frontend from `LogEntry[]` fetched via API. Never stored.

Week is defined as Monday 00:00 to Sunday 23:59.

| Metric | Calculation |
|--------|-------------|
| Weekly Smoothness Index | `banana_bro count / total entries` in the current week (Mon-Sun) |
| Monthly Banana Bro Rate | `banana_bro count / total entries` in the current calendar month |
| Current Streak | Consecutive days with at least one entry, counting back from today |
| Weekly shape breakdown | Count per `ShapeType` in the current week (Mon-Sun) |
| Accumulated SHIT Points | Computed from full log history using reward rules defined in design |
