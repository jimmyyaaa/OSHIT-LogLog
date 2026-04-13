# Module: Dashboard

## Responsibility

Fetch log data from the server via API, compute the three metrics, and render the dashboard view.

All user-facing text is in Chinese (Simplified).

---

## Metrics

All three metrics are computed on the frontend from entries fetched via `GET /api/logs`.

Week is defined as Monday 00:00 to Sunday 23:59.

### Weekly Smoothness Index

```
ideal_count = entries in current week (Mon-Sun) where shape === 'banana_bro'
total_count = total entries in current week (Mon-Sun)
smoothness  = total_count > 0 ? ideal_count / total_count : null
```

Display: percentage value + trend arrow compared to previous week (Mon-Sun): up, down, or flat. Show `--` if no data.

### Monthly Banana Bro Rate

```
ideal_count = entries this calendar month where shape === 'banana_bro'
total_count = total entries this calendar month
rate        = total_count > 0 ? ideal_count / total_count : null
```

Display: circular progress bar, 0-100%.

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
Semi-circular gauge. Zones: Smooth (>=60%) / Watch Out (30-59%) / SOS (<30%).

**`BananaBroProgress`**
Circular progress bar with percentage label.

**`StreakBadge`**
Badge-style display. Triggers upgrade animation at streak milestones.

---

## API Interface

```typescript
// services/logService.ts

getEntries(from: string, to: string): Promise<LogEntry[]>
```

Dashboard fetches entries for the relevant date ranges and computes all metrics on the frontend.
