"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { Role } from "@bustrack/types/enums"
import { useAuth } from "@/store/auth-context"

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isSuperAdmin = user?.role === Role.SUPER_ADMIN

  useEffect(() => {
    if (!mounted) return
    if (!isAuthenticated) {
      router.replace("/login")
    } else if (!isSuperAdmin) {
      // A school ADMIN token is a valid token, but every /api/superadmin/**
      // call would 403. Bounce rather than render a console of failed fetches.
      router.replace("/login")
    }
  }, [mounted, isAuthenticated, isSuperAdmin, router])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!isAuthenticated || !isSuperAdmin) return null

  return <>{children}</>
}
