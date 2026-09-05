# AMATSI Frontend

Next.js (App Router) frontend for AMATSI, the smart-irrigation platform for
smallholder farmers. Built with React 18, TypeScript, Tailwind CSS, and
Recharts.

## Deployed service

- Production: https://amatsi.vercel.app
- Staging/preview: auto-deployed per branch on Vercel

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app talks to the production backend
(`https://amatsi.onrender.com/api`) by default; to use a local backend, set
`NEXT_PUBLIC_API_URL` in `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Vercel injects `NEXT_PUBLIC_API_URL` at build time for the deployed app.

## Scripts

| Command          | Description                        |
|------------------|------------------------------------|
| `npm run dev`    | Start the dev server               |
| `npm run build`  | Production build (`next build`)    |
| `npm run start`  | Run the production build           |
| `npm run lint`   | ESLint (`next lint`)               |

## Pages

| Route                     | Description                                        |
|---------------------------|----------------------------------------------------|
| `/`                       | Marketing/landing page                             |
| `/auth/login`             | Phone + password sign in                           |
| `/auth/signup`            | Sign up                                            |
| `/dashboard`              | Overview: weather, soil, tank, usage, alerts       |
| `/dashboard/farms`        | Manage farms (add/edit/delete)                     |
| `/dashboard/alerts`       | Auto-sent SMS alert history + subscription status  |
| `/dashboard/irrigation`   | Irrigation details                                 |
| `/dashboard/planner`      | Seasonal planner                                   |
| `/dashboard/settings`     | Profile, password, language, SMS preferences       |

## Design system

- **Colors**: cream background (`#F5F1E8`), deep green accent (`#16301C`), warm
  orange (`#F0A24A`), bright green (`#34D399`) — defined in `tailwind.config.js`.
- **Fonts**: Fraunces (headings) + Public Sans (body), self-hosted via
  `next/font` in `app/layout.tsx`.
- **UI primitives**: `components/ui/` (Button, Input, Sidebar, Header,
  LocationPicker).

## Key flows

- **Auth**: short-lived access token + long-lived refresh token stored in
  `localStorage` via `lib/api/client.ts` (`setSession`); on 401 the client
  silently refreshes the access token (`/auth/refresh`) and retries once before
  bouncing to login. `hooks/useAuth.ts` tracks the logged-in user.
- **Location**: farmers pick a farm location by search or device GPS
  (`components/ui/LocationPicker.tsx`) — coordinates are never typed manually.
  Search uses OpenStreetMap Nominatim; the browser GPS provides the fallback.
- **Data**: all reads/writes go through `lib/api/client.ts` against the backend
  API; `lib/api/transform.ts` maps backend payloads to UI shapes. List endpoints
  default to `?? []` so pages never crash on empty data.
- **Honest empty states**: tank level and water usage show empty states when no
  telemetry exists, instead of fake/mock values.

## Folder structure

```
app/          App Router pages (auth, dashboard, api)
components/   Reusable UI (ui/) + dashboard + auth forms
hooks/        useAuth, useDashboard
lib/api/      Axios client + API transforms
lib/
types/        Shared TypeScript types
```

## Notes

- The dashboard intentionally shows honest empty/loading states and never
  fabricates data in the UI.