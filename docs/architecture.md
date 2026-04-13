# Architecture Overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript, Vite, Tailwind CSS |
| Backend | Java (Spring Boot) |
| Database | Server-local embedded database (e.g. SQLite / H2) |
| Report Generation | Frontend (canvas-based) |
| Points System | Frontend computation + backend claim relay |

---

## System Architecture

```
┌─────────────────────────────────┐
│          Web Client             │
│     React + TypeScript          │
│                                 │
│  ┌──────────────────────────┐   │
│  │     Data Service Layer   │   │
│  │     (REST API client)    │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │   SHIT Points Engine     │   │
│  │   (frontend-only logic)  │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │     Report Generator     │   │
│  │   (canvas, from API data)│   │
│  └──────────────────────────┘   │
└────────────┬────────────────────┘
             │ HTTPS / REST
┌────────────▼────────────────────┐
│          Java Backend           │
│                                 │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Log API │  │ Points API  │  │
│  └────┬─────┘  └──────┬──────┘  │
│       │               │         │
│  ┌────▼────────┐      │         │
│  │  Database   │      │         │
│  │  (local)    │      │         │
│  └─────────────┘      │         │
└───────────────────────┼─────────┘
                        │
              ┌─────────▼────────┐
              │  External Points │
              │     Module       │
              └──────────────────┘
```

---

## Key Design Decisions

**Data is stored in a server-local database**
All user log data is persisted in an embedded database on the server. The database should be free and file-based (e.g. SQLite or H2), requiring no external database service.

**Data access is encapsulated behind a service layer**
The frontend never reads the database directly. All data flows through REST API calls to the backend. The frontend data service layer abstracts API communication from UI components.

**SHIT Points are computed on the frontend**
The frontend determines which rewards are triggered (daily log, streaks, milestones) based on log data fetched from the API. Toast notifications are shown immediately. No backend involvement in points computation.

**Claiming SHIT Points goes through the backend**
When the user taps "Claim SHIT Points" on the Profile page, the frontend calls a backend API. The backend relays the claim to the external points module. API keys are never exposed to the client.

**Report generation is frontend-side**
Weekly report cards are rendered on the client using canvas, from data fetched via the API. The result is exported as an image for saving or sharing.

**Week is defined as Monday to Sunday**
All weekly metrics (Weekly Smoothness Index, weekly report) use Monday 00:00 to Sunday 23:59 as the week boundary.

**This module is part of a larger platform**
Login and user identity are managed externally. This module receives user context from the parent platform and does not implement authentication.

---

## Frontend Structure

```
src/
  pages/
    Home/
    Dashboard/
    Profile/
  components/
    LogSheet/
    Calendar/
    MetricCard/
  services/         # API client and data access
  types/            # TypeScript interfaces and types
  hooks/            # Shared React hooks
```

---

## Backend Structure

```
src/
  controller/       # REST endpoints
  service/          # Business logic
  model/            # Data models (JPA entities)
  repository/       # Database access (Spring Data)
  points/           # External points module integration
```
