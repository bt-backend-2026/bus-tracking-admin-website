import { Bus } from "lucide-react"
import { StatusBadge, type TripStatus } from "@/components/status-badge"

interface BusCardProps {
  busNumber: string
  route: string
  driver: string
  capacity: string
  status: TripStatus | string
  compact?: boolean
}

export function BusCard({ busNumber, route, driver, capacity, status, compact }: BusCardProps) {
  return (
    <div
      className={`rounded-box border border-base-300 bg-base-100 shadow-card card-hover ${compact ? "p-2.5" : "p-4"}`}
    >
      <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ${compact ? "h-8 w-8" : "h-10 w-10"}`}
        >
          <Bus size={compact ? 16 : 20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="t-label text-base-content truncate">{busNumber}</div>
              <div className={`t-body text-base-content/50 truncate ${compact ? "text-xs" : ""}`}>
                {route}
              </div>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
      <div className={`flex items-center gap-2 text-xs text-base-content/50 ${compact ? "mt-2" : "mt-2.5 border-t border-base-200 pt-2.5"}`}>
        <span>{driver}</span>
        <span className="text-base-content/20">&middot;</span>
        <span className="tabular-nums">{capacity}</span>
      </div>
    </div>
  )
}
