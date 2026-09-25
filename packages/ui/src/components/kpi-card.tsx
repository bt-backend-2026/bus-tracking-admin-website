import { type ReactNode } from "react"

interface KpiCardProps {
  title: string
  value: string | number
  description?: string
  valueColor?: string
  icon?: ReactNode
  compact?: boolean
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
}

export function KpiCard({ title, value, description, valueColor = "text-primary", icon, compact, trend, trendLabel }: KpiCardProps) {
  return (
    <div
      className={`rounded-box bg-base-100 ${compact ? "p-3" : "p-4"} ${compact ? "shadow-float" : "shadow-card"}`}
    >
      <div className="flex items-center justify-between">
        <div className="t-micro text-base-content/40">{title}</div>
        {icon && <span className="text-base-content/30 flex [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      </div>
      <div className={`${compact ? "mt-0" : "mt-1"} t-h2 ${valueColor}`}>{value}</div>
      {description && (
        <div className={`t-body text-base-content/50 ${compact ? "mt-0" : "mt-0.5"}`}>{description}</div>
      )}
      {trend && !compact && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span className={
            trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-base-content/40"
          }>
            {trend === "up" && "\u2191"}
            {trend === "down" && "\u2193"}
            {trend === "neutral" && "\u2192"}
          </span>
          {trendLabel && <span className="text-base-content/50">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
