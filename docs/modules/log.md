# Module: Log

## Responsibility

Handle the full log entry flow: trigger, form input, submission, feedback, and SHIT Points computation.

All user-facing text is in Chinese (Simplified).

---

## Flow

1. User taps the home button
2. Log sheet slides up (bottom sheet)
3. User selects shape (required), and optionally: color, feeling, contributing factors, location
4. User taps submit
5. Entry is saved to the server database via `POST /logs`
6. A random feedback line is shown based on the logged shape
7. Sheet closes, home button updates to post-log state
8. Frontend computes SHIT Points rewards and shows reward modals sequentially

---

## Components

**`LogSheet`**
Bottom sheet component. Contains all input selectors and submit button. Receives an `onSubmit` callback and a `onClose` callback.

**`ShapeSelector`**
Horizontal scrollable icon row. Each item shows an illustration and label. Single-select, required.

**`ColorSelector`**
Single-select tags. Optional.

**`FeelingTags`**
Single-select tags. Optional.

**`ContributingFactors`**
Multi-select tags. Optional.

**`LocationSelector`**
Single-select tags. Optional.

**`RewardModal`**
Displays earned SHIT Points. User dismisses by tapping an "OK" button. If multiple rewards are earned, modals are queued and shown one at a time.

---

## API Interface

```typescript
// services/logService.ts

createEntry(entry: {
  shape: ShapeType;
  color?: ColorType;
  feeling?: FeelingType;
  contributingFactors?: string[];
  location?: LocationType;
}): Promise<LogEntry>
getEntries(from: string, to: string): Promise<LogEntry[]>
```

All reads and writes go through the API service layer. Components never call the API directly.

---

## Feedback Copy

Feedback is selected based on `ShapeType`. All copy is in Chinese.

| Shape | Example copy |
|-------|-------------|
| `banana_bro` | *"教科书级香蕉君，今日任务完成。"* |
| `rabbit_pellets` | *"检测到兔子弹，多喝水是正道。"* |
| `twisted_rope` | *"扭曲绳已记录，慢慢来。"* |
| `soft_serve` | *"今日软冰淇淋，注意观察。"* |
| `splash_zone` | *"水花区已记录，好好休息。"* |

Multiple lines per type, selected randomly.

---

## SHIT Points Logic

Points are computed entirely on the frontend after a successful save. Only the first log of each day triggers rewards. Rewards are displayed as modals, not toasts.

```
on save success:
  rewards = []

  if first log of today:
    rewards.push("+1 SHIT Point")

  streak = computeStreak()
  if streak === 3  → rewards.push("+3 SHIT Point")
  if streak === 7  → rewards.push("+7 SHIT Point")
  if streak === 30 → rewards.push("+30 SHIT Point")

  if first time logging 'banana_bro' → rewards.push("+5 SHIT Point")
  if all 7 days this week logged (Mon-Sun) → rewards.push("+10 SHIT Point")

  show rewards as sequential modals:
    each modal displays the reward earned
    user taps "好！" to dismiss → next modal appears

// Referral reward is triggered externally when a referred friend completes 3 logs:
  referral completed → modal "+20 SHIT Point"
```

Points computation failures must not disrupt the user flow.
