# Page Design

---

## Navigation

A persistent top navigation bar sits above the home screen content, with two tabs: **Dashboard** and **Profile**. The home screen is the app's default landing view.

---

## Page 1 — Home

**Purpose:** Daily check-in entry and monthly record overview.

### Layout

**Top nav bar** — [Dashboard] [Profile]

**Center action area (dominant)** — One large animated primary button.
- Default: *"Tap to log today's movement!"*
- Post-first-log: *"Log again? Go for it!"* — users can log multiple times per day

**Bottom calendar** — Current month grid. Each logged day displays a poop icon. Display only.

---

## Page 2 — Log Sheet

**Purpose:** Complete a full log in under 15 seconds.

Triggered by the home button. Slides up as a bottom sheet.

### Layout

**Header:** *"Record this glorious journey"*

**Shape selector (required)** — Horizontal scroll of illustrated icons with labels. Selected item highlights.

| Icon | Label | Type |
|------|-------|------|
| (icon) | Rabbit Pellets | Type 1 — separate hard lumps |
| (icon) | Twisted Rope | Type 2 — lumpy sausage |
| (icon) | Banana Bro | Type 3 & 4 — ideal |
| (icon) | Soft Serve / Splash Zone | Type 5–7 — loose/liquid |

**Color selector (optional)** — Single-select tags:
> Golden Standard · Dark Roast · Clay Warning · …

**Feeling tags (optional)** — Single-select tags:
> Effortless · Could've Been More · Hard Won · …

**Contributing factors (optional)** — Multi-select tags:
> Stayed up late · Had spicy food · Stressed · …

**Location (optional)** — Single-select tags:
> Home · Office · School · Outdoors · Car · Plane · Boat

**Submit button** — Full-width at bottom. On confirm: sheet closes, random feedback line appears, home button updates to post-log state.

---

## Page 3 — Dashboard

**Purpose:** Show personal health data at a glance.

Named *"My Gut Dashboard"*. Styled as a car instrument panel or game stat screen.

### Layout

**Three metric cards:**

- **Weekly Smoothness Index** — `ideal logs / total logs` as a percentage, with a trend arrow (↑ ↓ →)
- **Monthly Banana Bro Rate** — Circular progress bar
- **Current Streak** — Badge-style display with day count

---

## Page 4 — Profile

**Purpose:** Report generation, data management, settings.

### Layout

**Top section** — Editable nickname, "Member for X days" counter, and total accumulated SHIT Points display.

**Primary actions (prominent, visually dominant):**

| Item | Description |
|------|-------------|
| Generate Weekly Report | Builds last week's shareable report image. |
| Claim SHIT Points | Claim accumulated SHIT Points. |

These two buttons should be large, high-contrast, and immediately visible — styled as primary CTAs.

**Secondary links (subdued, compact):**

| Item | Description |
|------|-------------|
| Export My Data | Packages all records into an encrypted backup file. |
| Privacy Policy | Explains data storage and privacy practices. |
| Health Tips Library | Browse collected gut health facts, written in-tone. |
| Feedback | Links to email or form. |
| About | Team intro and origin story, written with humor. |

Secondary items are styled as plain text links or a simple list, visually receding behind the primary actions.

---

## Key Interactions & States

**First successful log** — Celebration animation. Random feedback line shown. Calendar icon updates immediately. A reward modal appears showing earned SHIT Points; user taps "OK" to dismiss.

**Streak milestones (day 3 / 7 / 30)** — Current Streak badge on Dashboard animates an upgrade.

**Weekly report generation** — Loading animation (toilet flush → fresh). On completion, report preview auto-opens with a save/share button.
