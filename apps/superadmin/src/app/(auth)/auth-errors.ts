import type { AxiosError } from "axios"

/**
 * The backend envelope is always `{ success, data, message, error }`, with all
 * four keys present. Branch on `error` (the ErrorCode name), never on
 * `message` - the global handler copies raw exception text into BAD_REQUEST
 * messages, which can contain SQL and constraint names.
 *
 * A 401 raised by the JWT filter has a zero-length body, so this also has to
 * survive a response with no JSON at all.
 */
interface Envelope {
  error?: string | null
  message?: string | null
}

export function getApiErrorCode(err: unknown): string | null {
  const e = err as AxiosError<Envelope> | undefined
  return e?.response?.data?.error ?? null
}

const ERROR_COPY: Record<string, string> = {
  SCHOOL_NOT_FOUND: "That school no longer exists.",
  SCHOOL_NOT_EMPTY: "This school still has buses or students. Remove them before archiving.",
  SCHOOL_NOT_ARCHIVED: "Archive the school before deleting it permanently.",
  SCHOOL_SUSPENDED: "This school is suspended. Restore it first.",
  SCHOOL_ARCHIVED: "This school is archived.",
  EMAIL_ALREADY_EXISTS: "That email is already registered.",
  VALIDATION_ERROR: "Please check the highlighted fields.",
  ACCESS_DENIED: "You do not have permission to do that.",
  NOT_FOUND: "Not found.",
}

/**
 * Human-readable message for a failed call. Unknown codes fall back to a
 * generic string rather than passing server text through to the UI.
 */
export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  const code = getApiErrorCode(err)
  if (code && ERROR_COPY[code]) return ERROR_COPY[code]
  if (code === "BAD_REQUEST") return fallback
  if (code) return fallback
  // No envelope at all - typically the bodyless 401 from the JWT filter.
  const status = (err as AxiosError | undefined)?.response?.status
  if (status === 401) return "Your session expired. Sign in again."
  if (status === 403) return "You do not have permission to do that."
  return fallback
}
