/**
 * Ambient contract for the env vars this package reads.
 *
 * Next.js inlines `NEXT_PUBLIC_*` at build time, so these keys are statically
 * known and can be typo-checked. Apps reference this file from their own
 * `env.d.ts` (see `apps/admin/env.d.ts`) so the contract is declared once.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /** Base URL of the admin API, e.g. `http://localhost:8080/api/`. */
    readonly NEXT_PUBLIC_API_URL?: string
  }
}
