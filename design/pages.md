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
- Post-log: *"Today: Cleared! 🎉"* with a satisfying completion animation

**Bottom calendar** — Current month grid. Each logged day displays a small status icon (banana, pellets, etc.). Display only.

---

## Page 2 — Log Sheet

**Purpose:** Complete a full log in under 15 seconds.

Triggered by the home button. Slides up as a bottom sheet.

### Layout

**Header:** *"Record this glorious journey"*

**Shape selector (required)** — Horizontal scroll of illustrated icons with labels. Selected item highlights.

| Icon | Label | Type |
|------|-------|------|
| 🟤 | Rabbit Pellets | Type 1 — separate hard lumps |
| 🟤 | Twisted Rope | Type 2 — lumpy sausage |
| 🟠 | Banana Bro | Type 3 & 4 — ideal |
| 🟢 | Soft Serve / Splash Zone | Type 5–7 — loose/liquid |

**Feeling tags (optional)** — Single-select emoji tags:
> Effortless · Could've Been More · Hard Won · …

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

**Top section** — Editable nickname and "Member for X days" counter.

**Action list:**

| Item | Description |
|------|-------------|
| 🚀 Generate Weekly Report | Most prominent. Builds last week's shareable report image. |
| 📤 Export My Data | Packages all local records into an encrypted backup file. |
| 🔒 Privacy Policy | Explains that all data is stored locally only. |
| 💡 Health Tips Library | Browse collected gut health facts, written in-tone. |
| 📮 Feedback | Links to email or form. |
| About | Team intro and origin story, written with humor. |

---

## Key Interactions & States

**First successful log** — Celebration animation (emoji shower). Random feedback line shown. Calendar icon updates immediately.

**Streak milestones (day 3 / 7 / 30)** — Current Streak badge on Dashboard animates an upgrade.

**Weekly report generation** — Loading animation (toilet flush → fresh). On completion, report preview auto-opens with a save/share button.
