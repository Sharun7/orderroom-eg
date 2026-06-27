import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/lib/db"

interface StatusBadgeProps {
  status: OrderStatus
  size?: "sm" | "md" | "lg"
  className?: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string; dot: string }> = {
  draft: {
    label: "Draft",
    className: "bg-[rgba(100,116,139,0.15)] text-[#94A3B8] border border-[rgba(100,116,139,0.3)]",
    dot: "bg-[#94A3B8]",
  },
  sent: {
    label: "Sent",
    className: "bg-[rgba(59,130,246,0.15)] text-[#60A5FA] border border-[rgba(59,130,246,0.3)]",
    dot: "bg-[#60A5FA]",
  },
  partial: {
    label: "Partial",
    className: "bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]",
    dot: "bg-[#F59E0B]",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-[rgba(16,185,129,0.15)] text-[#34D399] border border-[rgba(16,185,129,0.3)]",
    dot: "bg-[#34D399]",
  },
  delivered: {
    label: "Delivered",
    className: "bg-[rgba(139,92,246,0.15)] text-[#A78BFA] border border-[rgba(139,92,246,0.3)]",
    dot: "bg-[#A78BFA]",
  },
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.className,
        sizeClasses[size],
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  )
}
