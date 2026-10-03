# API Reference

See `REQUIREMENT.md` for the full admin API contract — endpoints, request/response shapes, business rules, status enums, and known gaps. This is the source of truth for all feature work.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Stack

**Turborepo + npm-workspaces monorepo.** Root uses `npm@10.9.x` as package manager, `turbo` for task orchestration. All source lives in TypeScript; packages ship type definitions and are consumed through deep subpath imports via package `exports` maps.

- **Apps** (Next.js 16.2.6 App Router, React 19, TypeScript 5, Tailwind CSS 4):
  - `apps/admin` → `@bustrack/admin`, alias `@/` → app root, dev **:3000**
  - `apps/superadmin` → `@bustrack/superadmin`, alias `@/` → app root, dev **:3001**
- **Packages** (shared, TS source):
  - `packages/types` → `@bustrack/types` — enums + models/api interfaces
  - `packages/api-client` → `@bustrack/api-client` — axios service functions
  - `packages/hooks` → `@bustrack/hooks` — React Query domain hooks
  - `packages/ui` → `@bustrack/ui` — shared DaisyUI components
- **Tailwind v4** uses `@import "tailwindcss"` in CSS (not `@tailwind` directives) and `@theme inline` for theme vars; DaisyUI via `@plugin "daisyui"`
- **ESLint flat config** (`eslint.config.mjs`) per package/app

# Commands

| Command            | Action                                                    |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Dev all apps via turbo                                    |
| `npm run dev:admin`| Dev admin only (:3000) — `turbo dev --filter=@bustrack/admin` |
| `npm run dev:superadmin` | Dev superadmin only (:3001) — `turbo dev --filter=@bustrack/superadmin` |
| `npm run build`    | Production build of every workspace via turbo             |
| `npm run start`    | Start production servers                                  |
| `npm run lint`     | ESLint across workspaces                                  |

No test framework is installed. No CI, pre-commit hooks, or formatter config.

# Workspace aliases

- App-local (`@/` → app root) is **app-only** (components, store, schemas, app pages).
- Cross-package imports **must** use deep subpaths: `@bustrack/types/models/x`, `@bustrack/types/api/x`, `@bustrack/api-client/services/x`, `@bustrack/hooks/use-x`, `@bustrack/ui`.
- The `@bustrack/types` root barrel re-exports **enums only** to avoid model/api name collisions (e.g. `LoginRequest`, `listBuses`).

# Conventions

- `.env*` files are gitignored; document required env vars here if added
- **Env files are per-app, not at the repo root.** Next.js only loads `.env*` from the app directory it is running in (`apps/admin`, `apps/superadmin`). A root `.env` is silently ignored — `process.env.NEXT_PUBLIC_*` resolves to `undefined` at runtime with no error. Required vars:
  - `apps/admin/.env` + `apps/superadmin/.env` → `NEXT_PUBLIC_API_URL=http://localhost:8080/api/`
  - `apps/admin/.env` → `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (used by `src/components/dashboard-map.tsx`)
- Env var types are declared in ambient `.d.ts` files, one owner per file: `packages/api-client/src/env.d.ts` (API vars, referenced by both apps via `apps/*/env.d.ts`) and `apps/admin/env.d.ts` (admin-only vars). Add new `NEXT_PUBLIC_*` vars to the owning file, otherwise typos are not caught.
- Dark mode via `prefers-color-scheme` (no toggle)
- Geist font via `next/font/google`
- API interactions live in service functions under packages (deep-subpath imports, no aliases outside the owning package)
- Server state via `@tanstack/react-query`; no `useEffect` for data fetching
- Domain hooks return named inner hooks (e.g. `useBus().useBusList`); mutations call `invalidateQueries` + `toast`

# Seed data

- SUPER_ADMIN: `admin@schoolbus.com` / `Admin@1234` (platform-level, `school_id = null`)
- ADMIN (school 1): `admin@school1.com` / `password`

Both are seeded by the backend V3 migration; first superadmin login on :3001 uses the superadmin seed directly (no create-superadmin flow needed to start).
