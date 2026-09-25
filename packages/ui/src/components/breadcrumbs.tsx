import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbsProps {
  items: { label: string; href?: string }[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-xs text-base-content/50 mb-3">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          {item.href ? (
            <Link href={item.href} className="hover:text-base-content/70 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-base-content/70">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
