# Module: Report

## Responsibility

Generate a shareable weekly report card from server data and export it as an image.

All user-facing text is in Chinese (Simplified).

---

## Trigger

User taps "生成周报" on the Profile page. Generation is on-demand, not automatic.

---

## Data Inputs

All sourced from the server via `GET /api/logs`. Covers the previous week (Monday to Sunday).

| Input | Description |
|-------|-------------|
| Total logs | Count of entries in the target week (Mon-Sun) |
| Shape breakdown | Count per `ShapeType` |
| Smoothness Index | `banana_bro count / total count` |
| Peak Performance Day | Day of the week with the most entries |
| Current Streak | Consecutive days with at least one entry, counting back from Sunday |

---

## Report Sections

### 1. Smoothness Index
`banana_bro count / total count` as a percentage for the week.

### 2. Golden Ratio
Ideal shape frequency — breakdown of shape types with `banana_bro` highlighted.

### 3. Peak Performance Day
The day of the week with the highest log count. If tied, show the earliest day.

### 4. Streak Highlights
Current streak length and any milestones (3, 7, 30) reached during the report week.

---

## Rendering

The report card is rendered to a hidden `<canvas>` element and exported via `canvas.toDataURL('image/png')`.

No external library is required for MVP. If layout complexity increases, `html2canvas` can be introduced to render an HTML template instead.

---

## Share Mechanism

After generation:
1. Preview is shown to the user
2. Two options: **保存图片** (download link) / **分享** (Web Share API, falls back to copy link)
3. On first share: award 15 SHIT Points (frontend computation, shown as reward modal)

The exported image contains no user-identifiable information.
