/// <reference path="../../packages/api-client/src/env.d.ts" />

/**
 * Ambient contract for env vars owned by the admin app itself.
 * Shared API vars live in `packages/api-client/src/env.d.ts`.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /** Google Maps JS API key used by `src/components/dashboard-map.tsx`. */
    readonly NEXT_PUBLIC_GOOGLE_MAPS_KEY?: string
  }
}
