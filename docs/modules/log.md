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

Reward dispatch happens after a successful save. The frontend awaits each reward response and shows a toast notification per reward received.

```
on save success:
  show loading indicator

  await dispatch('daily_log')          → toast "🪙 +1 SHIT 已到账"

  streak = computeStreak()
  if streak === 3  → await dispatch('streak_3')   → toast "🔥 连续3天！+3 SHIT"
  if streak === 7  → await dispatch('streak_7')   → toast "⚡ 连续7天！+7 SHIT"
  if streak === 30 → await dispatch('streak_30')  → toast "👑 连续30天！+30 SHIT"

  if first time logging 'banana_bro' → await dispatch('first_ideal_shape') → toast "🍌 首次香蕉君！+5 SHIT"
  if all 7 days this week logged     → await dispatch('week_complete')     → toast "📅 本周全勤！+10 SHIT"

  hide loading indicator
```

Toasts are queued and shown sequentially. Each toast auto-dismisses after ~2 seconds. If the request fails, no toast is shown (silent failure — token errors must not disrupt the user flow).
