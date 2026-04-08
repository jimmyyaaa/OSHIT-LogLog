# MVP Scope

Three modules. One goal: prove the core loop works.

---

## Module 1 — Log (The Absolute Core)

**Target:** One full log in under 15 seconds, with humor and positive feedback throughout.

### Flow

**1. Home screen** — A single dominant button is the entire focus of the screen.
> Default: *"Tap to log today's movement!"*

**2. Log sheet** — Slides up on tap. Two fields only.

**Shape (required)** — Bristol Stool Scale, relabeled:

| Icon | Label | Type |
|------|-------|------|
| 🟤 | Rabbit Pellets | Type 1 — separate hard lumps |
| 🟤 | Twisted Rope | Type 2 — lumpy sausage |
| 🟠 | Banana Bro | Type 3 & 4 — ideal |
| 🟢 | Soft Serve / Splash Zone | Type 5–7 — loose/liquid |

**Feeling (optional)** — Single-select emoji tags:
> Effortless · Could've Been More · Hard Won · …

**3. Submit & token reward** — After submit, the sheet shows a brief loading state while awaiting the backend token response. Once confirmed, a reward toast appears (e.g. "🪙 +1 SHIT 已到账"). If multiple rewards trigger (e.g. daily log + streak milestone), toasts are shown sequentially. A random contextual health one-liner also appears:
> *"A textbook Banana Bro. Today's mission: complete. 🎉"*
> *"Rabbit Pellets detected. Water is the path to the light. 💧"*
> *"Splash Zone logged. Rest up, commander."*

**4. Home calendar** — Below the button, current month displayed as an icon-per-day grid. Display only.

---

## Module 2 — Dashboard

**Target:** Give users a reason to come back beyond logging.

Styled as a car instrument panel or game stat screen. Named *"My Gut Dashboard"*.

**Three metrics only:**

| Metric | Display |
|--------|---------|
| Weekly Smoothness Index | `ideal logs / total logs` as a percentage + trend arrow (↑↓→) |
| Monthly Banana Bro Rate | Circular progress bar |
| Current Streak | Badge-style display with day count |

No extra charts. No filler. These three tell the full story for an MVP user.

---

## Module 3 — Weekly Report (The Viral Engine)

**Target:** Generate a shareable artifact that spreads the app organically.

Generated on demand from the Profile page. Named *"Weekly Gut Chronicles"*. Rendered entirely on the frontend from local data.

### Report Format

A single card, three sections:

**Numbers** — Raw stats from the past 7 days:
- Total logs
- Shape type breakdown (e.g. Banana Bro ×3, Rabbit Pellets ×2)
- Smoothness Index percentage

**Diagnosis** — One auto-generated line based on the data:
> *"Banana Bro appeared 3 times. Gut systems: stable."*
> *"Rabbit Pellets dominated this week. Hydration may be low."*
> *"Splash Zone detected twice. Your gut had a rough week."*

**Suggestion** — One actionable tip tied to the diagnosis:
> *"Keep up the water intake and regular meals."*
> *"Try drinking a glass of water first thing in the morning."*
> *"Consider lighter meals and reduce stress if possible."*

### Share Mechanism

One-tap save to camera roll or direct share. The image contains no user-identifiable information.

---

## What MVP Explicitly Excludes

- Color field (logged, deferred to post-MVP)
- SHIT Squad / friend groups
- Community boards
- Smart nudges
- Token balance display (balance is managed by external token system)
- Contributing factors and location fields
