# Architecture Overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript, Vite, Tailwind CSS |
| Backend | Java (Spring Boot) |
| Data Storage | Browser localStorage (MVP) |
| Report Generation | Frontend (canvas-based) |
| Token System | External API (via backend) |

---

## System Architecture

```
┌─────────────────────────────────┐
│          Web Client             │
│     React + TypeScript          │
│                                 │
│  ┌──────────────────────────┐   │
│  │     Data Service Layer   │   │
│  │  (localStorage adapter)  │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │     Report Generator     │   │
│  │   (canvas, local data)   │   │
│  └──────────────────────────┘   │
└────────────┬────────────────────┘
             │ HTTPS / REST
┌────────────▼────────────────────┐
│          Java Backend           │
│                                 │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Log API │  │ Token relay │  │
│  └──────────┘  └──────┬──────┘  │
└─────────────────────┬─┼─────────┘
                      │ │
            ┌─────────▼─▼────────┐
            │  Token Service     │
            │  (External API)    │
            └────────────────────┘
```

---

## Key Design Decisions

**Data storage is localStorage in MVP**
All user log data is stored in the browser locally. No user account or login is required for this module — authentication is handled by the parent platform.

**Data access must be encapsulated**
The frontend must never read/write localStorage directly in components. All data access goes through a dedicated service layer. This ensures that migrating to a backend database requires only replacing the service layer, with zero changes to UI components.

**Report generation is frontend-side**
Weekly report cards are rendered on the client using canvas, entirely from local data. No backend call is needed. The result is exported as an image for saving or sharing.

**Token rewards go through the backend**
Frontend signals reward-eligible actions to the backend. The backend validates and calls the external token API. API keys are never exposed to the client.

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
  services/         # All data access and API calls
  types/            # TypeScript interfaces and types
  hooks/            # Shared React hooks
```

---

## Backend Structure

```
src/
  controller/       # REST endpoints
  service/          # Business logic
  model/            # Data models
  token/            # External token API integration
```
