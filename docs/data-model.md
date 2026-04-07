# Data Model

---

## LogEntry

The core data unit. One entry per visit.

```typescript
interface LogEntry {
  id: string          // UUID, generated client-side
  timestamp: number   // Unix timestamp (ms)
  shape: ShapeType    // Required
  feeling?: FeelingType  // Optional
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

## FeelingType

```typescript
type FeelingType =
  | 'effortless'
  | 'could_have_been_more'
  | 'hard_won'
```

---

## Local Storage Schema

All entries are stored under a single key.

```typescript
// localStorage key: 'loglog_entries'
// value: JSON.stringify(LogEntry[])
```

---

## Derived Data

Computed at runtime from `LogEntry[]`. Never stored.

| Metric | Calculation |
|--------|-------------|
| Weekly Smoothness Index | `banana_bro count / total entries` in the past 7 days |
| Monthly Banana Bro Rate | `banana_bro count / total entries` in the current month |
| Current Streak | Consecutive days with at least one entry, counting back from today |
| Weekly shape breakdown | Count per `ShapeType` in the past 7 days |

---

## Migration Note

When migrating from localStorage to a database, `LogEntry` maps directly to a table row. The `id` field (UUID) serves as primary key. Only the data service layer needs to change — no UI components are affected.
