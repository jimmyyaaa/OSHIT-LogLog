# User Flow Design

---

## Phase 1 — Log (The Daily Ritual)

### Check-in
After the deed is done, the user lands on a check-in screen centered around one large, satisfying button. The copy is celebratory, not clinical — e.g. *"Mission Accomplished!"*, *"Smooth Delivery!"*. The act of tapping it is itself a small emotional release.

Users can log multiple times per day. The calendar displays a poop icon on any day with at least one log. All log data is stored in the server-side database.

### Logging Details
A quick, playful form follows. Required fields stay minimal; optional fields add depth.

**Shape** (required, Bristol Stool Scale, relabeled)
> Rabbit Pellets · Twisted Rope · Banana Bro · Soft Serve · Splash Zone

**Color** *(optional)*
> Golden Standard · Dark Roast · Clay Warning · …

**Feeling** *(optional)*
> Effortless · Could've Been More · Hard Won

**Contributing factors** *(optional)*
> Stayed up late · Had spicy food · Stressed · …

**Location** *(optional)*
> Home · Office · School · Outdoors · Car · Plane · Boat

---

## Phase 2 — Share & Engage (The Viral Layer)

### SHIT Squad
Users can opt in to share their daily status — stripped of raw details, shown only as a status icon + playful copy (e.g. *"Survived the Rabbit Pellets today!"*) — with a small trusted group: a partner, a best friend, a squad. Visibility is always explicit and mutual.

### Weekly Report
The user can manually generate a **"Weekly Gut Chronicles"** from the Profile page — a humorous data digest covering the previous week (Monday to Sunday):
- Smoothness Index
- Golden Ratio (ideal shape frequency)
- Peak Performance Day
- Streak highlights

The report is designed to be screenshot-and-shared. This is the primary organic growth surface.

### Achievements
Badge system rewarding consistency and curiosity:
> 7-Day Streak · Monthly Perfect Attendance · Banana Bro Enthusiast · …

### SHIT Point Rewards

SHIT Points are computed and awarded entirely on the frontend. Only the **first log of each day** earns rewards. Subsequent logs on the same day are recorded but do not trigger reward points.

| Action | Reward |
|--------|--------|
| Daily log (first of the day) | 1 SHIT Point |
| 3-day streak bonus | +3 SHIT Point |
| 7-day streak bonus | +7 SHIT Point |
| 30-day streak bonus | +30 SHIT Point |
| First "ideal shape" logged | 5 SHIT Point |
| Full week of logs | 10 SHIT Point |
| First weekly report shared | 15 SHIT Point |
| Referral (friend completes 3 logs) | 20 SHIT Point |

Streaks reset on any missed day.

**Reward display:** When a reward condition is met, a modal appears showing the reward earned (e.g. "+1 SHIT Point"). The user dismisses the modal by tapping an "OK" button. If multiple rewards are earned at once, modals are shown sequentially — each one appears after the previous is dismissed. The Profile page shows the user's total accumulated SHIT Points.

**Claiming SHIT Points:** The Profile page includes a prominent "Claim SHIT Points" button. Pressing it calls the backend API, which relays the claim to the external points module. The frontend awaits the response and shows success/failure feedback.

---

## Phase 3 — Retention & Long-term Value

### Personal Health Dashboard
Behind the playful front end lives a real health timeline: frequency trends, shape distribution over time, correlation with logged factors. The data is always the user's own.

### Smart Nudges
When patterns shift — three consecutive abnormal logs, a long streak broken — the app sends a gentle, on-brand nudge:
> *"Rabbit Pellets three days running. Maybe drink some water, Your Majesty?"*

### Community
Opt-in anonymous community spaces around shared experiences:
- Constipation Alliance
- Gut Rant Corner

Low-pressure, humorous, and genuinely supportive.
