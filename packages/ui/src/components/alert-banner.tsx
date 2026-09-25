import { type ReactNode } from "react"
import { TriangleAlert, Info, CircleCheck, CircleX } from "lucide-react"

type AlertTone = "warning" | "info" | "success" | "error"

const toneIcons: Record<AlertTone, ReactNode> = {
  warning: <TriangleAlert size={16} />,
  info: <Info size={16} />,
  success: <CircleCheck size={16} />,
  error: <CircleX size={16} />,
}

interface AlertBannerProps {
  tone: AlertTone
  icon?: ReactNode
  title: string
  description?: string
  compact?: boolean
}

const toneStyles: Record<AlertTone, { bg: string; border: string; iconColor: string; titleColor: string }> = {
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/20",
    iconColor: "text-warning",
    titleColor: "text-warning",
  },
  info: {
    bg: "bg-info/10",
    border: "border-info/20",
    iconColor: "text-info",
    titleColor: "text-info",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/20",
    iconColor: "text-success",
    titleColor: "text-success",
  },
  error: {
    bg: "bg-error/10",
    border: "border-error/20",
    iconColor: "text-error",
    titleColor: "text-error",
  },
}

export function AlertBanner({ tone, icon, title, description, compact }: AlertBannerProps) {
  const s = toneStyles[tone]
  const resolvedIcon = icon ?? toneIcons[tone]

  return (
    <div className={`flex items-start rounded-box ${s.bg} border ${s.border} ${compact ? "gap-2 p-2.5" : "gap-3 p-4"}`}>
      <span className={`${compact ? "" : "mt-0.5"} ${s.iconColor}`}>{resolvedIcon}</span>
      <div className="flex-1 min-w-0">
        <div className={`t-label ${s.titleColor} ${compact ? "text-xs" : ""}`}>{title}</div>
        {description && (
          <div className={`t-body text-base-content/50 ${compact ? "mt-0 text-xs" : "mt-0.5"}`}>{description}</div>
        )}
      </div>
    </div>
  )
}
