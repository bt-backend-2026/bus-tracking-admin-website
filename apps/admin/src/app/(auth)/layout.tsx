"use client"

import { type ReactNode } from "react"
import { Menu } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/sidebar"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="drawer lg:drawer-open">
        <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col bg-base-200">
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-base-300 bg-base-100/80 px-4 py-3 backdrop-blur-md lg:hidden">
            <label htmlFor="sidebar-drawer" className="btn btn-ghost btn-sm drawer-button">
              <Menu size={20} />
            </label>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-content text-xs font-bold">
                B
              </div>
              <span className="font-semibold">BusTrack</span>
            </div>
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <div className="drawer-side z-50">
          <Sidebar />
        </div>
      </div>
    </AuthGuard>
  )
}
