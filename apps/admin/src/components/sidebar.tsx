"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/store/auth-context"
import { LayoutDashboard, Clock, Bus, Users, UserCheck, GraduationCap, LogOut } from "lucide-react"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    href: "/trips",
    label: "Trips",
    icon: <Clock size={20} />,
  },
  {
    href: "/bus",
    label: "Buses",
    icon: <Bus size={20} />,
  },
  {
    href: "/driver",
    label: "Drivers",
    icon: <Users size={20} />,
  },
  {
    href: "/parent",
    label: "Parents",
    icon: <UserCheck size={20} />,
  },
  {
    href: "/student",
    label: "Students",
    icon: <GraduationCap size={20} />,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  return (
    <>
      <label htmlFor="sidebar-drawer" className="drawer-overlay z-40" />
      <aside className="flex min-h-full w-64 flex-col bg-base-100 text-base-content shadow-sheet">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content text-sm font-bold shadow-xs">
            B
          </div>
          <div>
            <span className="block text-base font-semibold tracking-tight">BusTrack</span>
            <span className="t-micro text-base-content/40">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "nav-active font-semibold rounded-r-lg"
                        : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                    }`}
                  >
                    <span className={`${isActive ? "text-primary" : "text-base-content/40 group-hover:text-base-content/60"} transition-colors`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral text-neutral-content text-sm font-semibold">
              {user?.name?.charAt(0) ?? "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate t-label text-base-content">{user?.name ?? "User"}</p>
              <p className="truncate t-micro text-base-content/40">{user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm mt-1.5 w-full justify-start gap-2 text-base-content/50 hover:text-base-content"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
