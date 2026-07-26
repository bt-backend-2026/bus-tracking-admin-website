export type TripStatus =
  | "on-the-way"
  | "in-transit"
  | "on-board"
  | "arriving-soon"
  | "waiting"
  | "emergency"
  | "off-duty"
  | "completed"
  | "in-progress"
  | "scheduled"
  | "delayed"
  | "cancelled"
  | "active"
  | "inactive"
  | "on-duty"
  | "on-leave"
  | "pending"

const statusConfig: Record<string, { badge: string; dotBg: string; pulse: boolean }> = {
  "on-the-way": { badge: "badge-success", dotBg: "bg-white", pulse: true },
  "in-transit": { badge: "badge-info", dotBg: "bg-white", pulse: false },
  "on-board": { badge: "badge-success", dotBg: "bg-white", pulse: false },
  "arriving-soon": { badge: "badge-warning", dotBg: "bg-white", pulse: false },
  waiting: { badge: "badge-ghost", dotBg: "bg-neutral/40", pulse: false },
  emergency: { badge: "badge-error", dotBg: "bg-white", pulse: true },
  "off-duty": { badge: "badge-ghost", dotBg: "bg-neutral/40", pulse: false },
  completed: { badge: "badge-success", dotBg: "bg-white", pulse: false },
  "in-progress": { badge: "badge-info", dotBg: "bg-white", pulse: true },
  scheduled: { badge: "badge-ghost", dotBg: "bg-neutral/40", pulse: false },
  delayed: { badge: "badge-warning", dotBg: "bg-white", pulse: false },
  cancelled: { badge: "badge-error", dotBg: "bg-white", pulse: false },
  active: { badge: "badge-success", dotBg: "bg-white", pulse: false },
  inactive: { badge: "badge-ghost", dotBg: "bg-neutral/40", pulse: false },
  "on-duty": { badge: "badge-success", dotBg: "bg-white", pulse: false },
  "on-leave": { badge: "badge-warning", dotBg: "bg-white", pulse: false },
  pending: { badge: "badge-warning", dotBg: "bg-white", pulse: false },
}

interface StatusBadgeProps {
  status: TripStatus | string
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? {
    badge: "badge-ghost",
    dotBg: "bg-neutral/40",
    pulse: false,
  }

  const isGhost = config.badge === "badge-ghost"

  return (
    <span className={`badge badge-sm gap-1.5 ${config.badge} ${isGhost ? "text-base-content/50" : ""}`}>
      <span
        className={`dot ${config.dotBg} ${config.pulse ? "dot-pulse" : ""}`}
      />
      {label ?? status}
    </span>
  )
}
