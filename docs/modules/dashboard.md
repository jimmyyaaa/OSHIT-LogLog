# Module: Dashboard

## Responsibility

Read log data from localStorage, compute the three metrics, and render the dashboard view.

---

## Metrics

All three metrics are computed from local data on page load.

### Weekly Smoothness Index

```
ideal_count = entries in past 7 days where shape === 'banana_bro'
total_count = total entries in past 7 days
smoothness  = total_count > 0 ? ideal_count / total_count : null
```

Display: percentage value + trend arrow compared to previous 7 days (↑ ↓ →). Show `--` if no data.

### Monthly Banana Bro Rate

```
ideal_count = entries this calendar month where shape === 'banana_bro'
total_count = total entries this calendar month
rate        = total_count > 0 ? ideal_count / total_count : null
```

Display: circular progress bar, 0–100%.

### Current Streak

```
streak = 0
date   = today

loop:
  if any entry exists on `date` → streak++, date = date - 1 day
  else → break
```

Display: badge with day count. Animates on milestone days (3, 7, 30).

---

## Components

**`MetricCard`**
Reusable card wrapper with title and content slot.

**`SmoothnessGauge`**
Semi-circular gauge. Zones: Smooth (≥60%) / Watch Out (30–59%) / SOS (<30%).

**`BananaBroProgress`**
Circular progress bar with percentage label.

**`StreakBadge`**
Badge-style display. Triggers upgrade animation at streak milestones.

---

## Data Service Interface

```typescript
// services/logService.ts

getEntriesInRange(from: number, to: number): LogEntry[]
```

Dashboard computes all metrics itself from raw entries. No separate aggregation service needed in MVP.
