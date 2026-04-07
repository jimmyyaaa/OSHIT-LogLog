# Module: Report

## Responsibility

Generate a shareable weekly report card from local data and export it as an image.

---

## Trigger

User taps "Generate Weekly Report" on the Profile page. Generation is on-demand, not automatic.

---

## Data Inputs

All sourced from localStorage via the data service. Covers the past 7 days.

| Input | Description |
|-------|-------------|
| Total logs | Count of entries in the past 7 days |
| Shape breakdown | Count per `ShapeType` |
| Smoothness Index | `banana_bro count / total count` |

---

## Report Sections

### 1. Numbers
Raw stats, plainly listed:
- Total logs this week
- Shape type counts (e.g. Banana Bro ×3, Rabbit Pellets ×2)
- Smoothness Index percentage

### 2. Diagnosis
One auto-generated line based on the dominant shape pattern:

| Condition | Diagnosis |
|-----------|-----------|
| `banana_bro` ≥ 50% | *"Gut systems: stable. You're in the zone."* |
| `rabbit_pellets` or `twisted_rope` dominant | *"Signs of low hydration. Things are moving slowly."* |
| `splash_zone` or `soft_serve` dominant | *"Your gut had a rough week. Take it easy."* |
| No data | *"No data this week. The gut waits for no one."* |

### 3. Suggestion
One actionable tip tied to the diagnosis:

| Condition | Suggestion |
|-----------|-----------|
| Stable | *"Keep up the water intake and regular meals."* |
| Low hydration | *"Try drinking a glass of water first thing in the morning."* |
| Loose | *"Consider lighter meals and reduce stress if possible."* |

---

## Rendering

The report card is rendered to a hidden `<canvas>` element and exported via `canvas.toDataURL('image/png')`.

No external library is required for MVP. If layout complexity increases, `html2canvas` can be introduced to render an HTML template instead.

---

## Share Mechanism

After generation:
1. Preview is shown to the user
2. Two options: **Save to photos** (download link) / **Share** (Web Share API, falls back to copy link)
3. On first share: dispatch token reward `first_report_shared` to backend

The exported image contains no user-identifiable information.
