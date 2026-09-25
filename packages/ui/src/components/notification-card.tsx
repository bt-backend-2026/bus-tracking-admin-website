import { type ReactNode } from "react"

interface NotificationCardProps {
  icon: ReactNode
  iconBg?: string
  title: string
  description: string
  timestamp: string
  compact?: boolean
  flat?: boolean
}

export function NotificationCard({
  icon,
  iconBg = "bg-success",
  title,
  description,
  timestamp,
  compact,
  flat,
}: NotificationCardProps) {
  const cardClasses = flat
    ? "flex items-start"
    : "flex items-start rounded-box bg-base-100 shadow-card"
  const spacingClasses = compact ? "gap-2 p-2.5" : "gap-3 p-4"

  return (
    <div className={`${cardClasses} ${spacingClasses}`}>
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl ${iconBg} text-white ${compact ? "h-8 w-8" : "h-10 w-10"}`}
      >
        <span className={compact ? "flex [&>svg]:h-4 [&>svg]:w-4" : "flex"}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className={`t-label text-base-content ${compact ? "text-xs" : ""}`}>{title}</div>
        <div className={`t-body text-base-content/50 ${compact ? "text-xs mt-0" : "mt-0.5"}`}>{description}</div>
      </div>
      <span className={`t-micro text-base-content/30 shrink-0 ${compact ? "" : "pt-0.5"}`}>{timestamp}</span>
    </div>
  )
}
