# Module: Log

## Responsibility

Handle the full log entry flow: trigger, form input, submission, feedback, and token reward dispatch.

---

## Flow

1. User taps the home button
2. Log sheet slides up (bottom sheet)
3. User selects shape (required) and feeling (optional)
4. User taps submit
5. Entry is saved to localStorage via the data service
6. A random feedback line is shown based on the logged shape
7. Sheet closes, home button updates to post-log state
8. Token reward is dispatched to the backend (`daily_log`)
9. If applicable, streak milestone rewards are also dispatched (`streak_3`, `streak_7`, `streak_30`)

---

## Components

**`LogSheet`**
Bottom sheet component. Contains the shape selector, feeling tags, and submit button. Receives an `onSubmit` callback and a `onClose` callback.

**`ShapeSelector`**
Horizontal scrollable icon row. Each item shows an illustration and label. Single-select, required.

**`FeelingTags`**
Icon button row. Single-select, optional.

**`FeedbackToast`**
Displays the post-submit one-liner. Auto-dismisses after ~2 seconds.

---

## Data Service Interface

```typescript
// services/logService.ts

saveEntry(entry: LogEntry): void
getEntries(): LogEntry[]
getEntriesInRange(from: number, to: number): LogEntry[]
```

All reads and writes go through this interface. Components never access localStorage directly.

---

## Feedback Copy

Feedback is selected based on `ShapeType`:

| Shape | Example copy |
|-------|-------------|
| `banana_bro` | *"A textbook Banana Bro. Today's mission: complete. 🎉"* |
| `rabbit_pellets` | *"Rabbit Pellets detected. Water is the path to the light. 💧"* |
| `twisted_rope` | *"Twisted Rope logged. Things are moving, just slowly."* |
| `soft_serve` | *"Soft Serve today. Keep an eye on it."* |
| `splash_zone` | *"Splash Zone logged. Rest up, commander."* |

Multiple lines per type, selected randomly.

---

## Token Reward Logic

Reward dispatch happens after a successful save, not before.

```
on save success:
  dispatch('daily_log')

  streak = computeStreak()
  if streak === 3  → dispatch('streak_3')
  if streak === 7  → dispatch('streak_7')
  if streak === 30 → dispatch('streak_30')

  if first time logging 'banana_bro' → dispatch('first_ideal_shape')
  if all 7 days this week logged     → dispatch('week_complete')
```
