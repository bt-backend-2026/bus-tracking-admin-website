"use client"

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from "react"
import type { UserSummary } from "@bustrack/types/models/auth"

interface AuthState {
  user: UserSummary
  token: string
}

interface AuthContextValue {
  user: UserSummary | null
  token: string | null
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

let cached: { json: string; value: AuthState } | null = null

function getSnapshot(): AuthState | null {
  const storedToken = localStorage.getItem("auth_token")
  const storedUser = localStorage.getItem("auth_user")
  if (storedToken && storedUser) {
    const json = storedToken + storedUser
    if (cached && cached.json === json) return cached.value
    cached = { json, value: { token: storedToken, user: JSON.parse(storedUser) } }
    return cached.value
  }
  cached = null
  return null
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getServerSnapshot(): null {
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const token = snapshot?.token ?? null
  const user = snapshot?.user ?? null

  const logout = useCallback(async () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    localStorage.removeItem("refresh_token")
    window.dispatchEvent(new StorageEvent("storage"))
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
