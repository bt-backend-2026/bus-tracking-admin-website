"use client"

import { useState, useMemo } from "react"
import { Bus, GraduationCap, Clock, CircleCheck } from "lucide-react"
import { KpiCard } from "@bustrack/ui"
import { NotificationCard } from "@bustrack/ui"
import { AlertBanner } from "@bustrack/ui"
import { DashboardMap } from "@/components/dashboard-map"
import useDashboard from "@bustrack/hooks/use-dashboard"
import useLiveLocation from "@bustrack/hooks/use-live-location"

interface ActivityItem {
  id: number
  title: string
  description: string
  time: string
  type: "success" | "info"
}

interface AlertItem {
  id: number
  tone: "warning" | "info" | "success"
  title: string
  description: string
}

const initialActivity: ActivityItem[] = [
  { id: 1, title: "Bus #12 arrived at Maple St stop", description: "Scheduled stop completed", time: "2 min ago", type: "success" },
  { id: 2, title: "Route 5 completed", description: "Driver John D. finished at 8:45 AM", time: "15 min ago", type: "success" },
  { id: 3, title: "New student assigned", description: "Sarah K. assigned to Bus #8", time: "1 hr ago", type: "info" },
  { id: 4, title: "Route 3 schedule updated", description: "Afternoon times adjusted", time: "2 hrs ago", type: "success" },
]

const initialAlerts: AlertItem[] = [
  { id: 1, tone: "warning", title: "Bus #07 maintenance due in 3 days", description: "Schedule service appointment" },
  { id: 2, tone: "info", title: "Driver license renewal pending", description: "5 drivers need to update their licenses" },
  { id: 3, tone: "success", title: "All GPS trackers online", description: "System fully operational" },
]

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-base-300/50 ${className ?? ""}`} />
}

function LoadingCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-box bg-base-100 p-4 shadow-card">
          <SkeletonBlock className="mb-2 h-3 w-16" />
          <SkeletonBlock className="mb-1 h-7 w-20" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

function LoadingRightColumn() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-box bg-base-100 p-4 shadow-card">
          <SkeletonBlock className="mb-3 h-4 w-28" />
          <div className="space-y-2">
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [activity] = useState<ActivityItem[]>(initialActivity)
  const [alerts] = useState<AlertItem[]>(initialAlerts)
  const [selectedBus, setSelectedBus] = useState<number | null>(null)

  const { useDashboardStats, useLiveBuses } = useDashboard()
  const { useLiveLocationUpdates } = useLiveLocation()

  const { data: statsRes, isLoading: statsLoading } = useDashboardStats()
  const { data: liveRes, isLoading: liveLoading, isError: liveError } = useLiveBuses()

  const stats = statsRes?.data ?? null
  const liveBuses = useMemo(() => liveRes?.data ?? [], [liveRes])
  const loading = statsLoading || liveLoading

  const liveBusIds = useMemo(() => liveBuses.map((b) => b.busId), [liveBuses])
  const livePositions = useLiveLocationUpdates(liveBusIds)

  const mergedBuses = useMemo(
    () =>
      liveBuses.map((b) => ({
        ...b,
        latitude: livePositions[b.busId]?.latitude ?? b.latitude,
        longitude: livePositions[b.busId]?.longitude ?? b.longitude,
        recordedAt: livePositions[b.busId]?.recordedAt ?? b.recordedAt,
      })),
    [liveBuses, livePositions],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="t-h1">Dashboard</h1>
          <p className="t-body text-base-content/50 mt-0.5">Overview of your bus tracking system</p>
        </div>
      </div>

      {loading ? (
        <>
          <LoadingCards />
          <div className="grid gap-4 lg:grid-cols-2 items-start">
            <div className="rounded-box bg-base-100 p-4 shadow-card">
              <SkeletonBlock className="mb-2 h-4 w-16" />
              <SkeletonBlock className="h-[400px] w-full" />
            </div>
            <LoadingRightColumn />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Active Buses"
              value={stats?.activeBuses ?? 0}
              description={`${stats?.totalBuses ?? 0} total in fleet`}
              valueColor="text-primary"
              icon={<Bus size={16} />}
            />
            <KpiCard
              title="Total Buses"
              value={stats?.totalBuses ?? 0}
              description="In your fleet"
              valueColor="text-secondary"
              icon={<Bus size={16} />}
            />
            <KpiCard
              title="Students Riding"
              value={stats?.studentsRiding ?? 0}
              description="Currently assigned"
              valueColor="text-accent"
              icon={<GraduationCap size={16} />}
            />
            <KpiCard
              title="On-Time"
              value={`${stats?.onTimePct ?? 0}%`}
              description="Arrival accuracy"
              valueColor="text-success"
              icon={<Clock size={16} />}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2 items-start">
            <DashboardMap
              buses={mergedBuses}
              selectedBusId={selectedBus}
              onBusSelect={setSelectedBus}
            />

            <div className="flex flex-col gap-4">
              <div className="rounded-box bg-base-100 shadow-card">
                <div className="border-b border-base-200 px-3 py-2.5">
                  <h2 className="t-label font-semibold">Recent Activity</h2>
                </div>
                <div className="divide-y divide-base-200">
                  {activity.map((item) => (
                    <NotificationCard
                      key={item.id}
                      flat
                      compact
                      icon={<CircleCheck size={16} />}
                      iconBg={item.type === "info" ? "bg-info" : "bg-success"}
                      title={item.title}
                      description={item.description}
                      timestamp={item.time}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-box bg-base-100 shadow-card">
                <div className="border-b border-base-200 px-3 py-2.5">
                  <h2 className="t-label font-semibold">Live Buses</h2>
                </div>
                {liveError ? (
                  <div className="px-3 py-6 text-center text-sm text-base-content/40">Failed to load live buses</div>
                ) : liveBuses.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-base-content/40">No live buses right now</div>
                ) : (
                  <div className="divide-y divide-base-200">
                    {mergedBuses.map((b) => (
                      <button
                        key={b.busId}
                        type="button"
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 ${
                          selectedBus === b.busId
                            ? "bg-primary/5"
                            : "hover:bg-base-200/50"
                        }`}
                        onClick={() => setSelectedBus(b.busId)}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                            selectedBus === b.busId
                              ? "bg-primary text-primary-content shadow-sm"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Bus size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="t-label text-base-content text-xs">{b.displayId}</span>
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                          </div>
                          <div className="text-[11px] text-base-content/50 truncate mt-0.5">
                            {b.latitude != null && b.longitude != null
                              ? `${b.latitude.toFixed(4)}, ${b.longitude.toFixed(4)}`
                              : "No position data"}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-box bg-base-100 shadow-card">
                <div className="border-b border-base-200 px-3 py-2.5">
                  <h2 className="t-label font-semibold">Alerts</h2>
                </div>
                <div className="divide-y divide-base-200">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="px-3 py-2.5">
                      <AlertBanner compact tone={alert.tone} title={alert.title} description={alert.description} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
