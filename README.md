# Bus Tracking Admin Portal

Monorepo (Turborepo + npm workspaces) for the bus-tracking admin applications.

## What's inside

- **Apps**
  - `apps/admin` → `@bustrack/admin` — operator/admin portal, dev on **:3000**
  - `apps/superadmin` → `@bustrack/superadmin` — super-admin portal, dev on **:3001**
- **Packages** (shared TypeScript source)
  - `packages/types` → `@bustrack/types` — enums + models/api interfaces
  - `packages/api-client` → `@bustrack/api-client` — axios services + libs
  - `packages/hooks` → `@bustrack/hooks` — React Query domain hooks
  - `packages/ui` → `@bustrack/ui` — shared DaisyUI components

Every "app" is a standard Turborepo [Next.js](https://nextjs.org) app (App Router, React 19, TypeScript, Tailwind CSS 4 + DaisyUI). Packages are TS source consumed through package `exports` maps.

## Getting started

Prerequisites: Node 20+ (npm 10.x), `turbo` (bundled as root devDependency).

```bash
npm install
npm run dev            # dev all apps (admin :3000, superadmin :3001)
npm run dev:admin      # admin only (:3000)  -- --filter=@bustrack/admin
npm run dev:superadmin # superadmin only (:3001)
```

## Building

```bash
npm run build   # turbo build across all workspaces
npm run start   # start production servers
npm run lint    # ESLint across workspaces
```

## Cross-package imports

Packages use **deep subpath imports** via their `exports` maps — never the root barrel when name collisions risk ambiguity:

```typescript
import { Role, AccountStatus } from "@bustrack/types/enums";
import { BusSummaryResponse } from "@bustrack/types/models/bus";
import { listBuses } from "@bustrack/api-client/services/bus-service";
import { useBus } from "@bustrack/hooks";
import { Button } from "@bustrack/ui";
```

App-local code stays under `@/*` aliases; everything shared comes from `@bustrack/*`.
