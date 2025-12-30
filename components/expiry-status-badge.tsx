import { AlertCircle, TrendingDown, AlertTriangle, Ban } from "lucide-react"

type ExpiryStatus = "FRESH" | "FADING" | "EXPIRED" | "OVERUSED"

type ExpiryStatusBadgeProps = {
  status: ExpiryStatus
  size?: "sm" | "md" | "lg"
}

export function ExpiryStatusBadge({ status, size = "md" }: ExpiryStatusBadgeProps) {
  const getStatusConfig = (status: ExpiryStatus) => {
    switch (status) {
      case "FRESH":
        return {
          label: "Fresh",
          icon: AlertCircle,
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          textColor: "text-green-500",
          iconColor: "text-green-500",
        }
      case "FADING":
        return {
          label: "Fading",
          icon: TrendingDown,
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          textColor: "text-yellow-500",
          iconColor: "text-yellow-500",
        }
      case "EXPIRED":
        return {
          label: "Expired",
          icon: AlertTriangle,
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          textColor: "text-red-500",
          iconColor: "text-red-500",
        }
      case "OVERUSED":
        return {
          label: "Overused",
          icon: Ban,
          bgColor: "bg-muted",
          borderColor: "border-muted-foreground/30",
          textColor: "text-muted-foreground",
          iconColor: "text-muted-foreground",
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg ${sizeClasses[size]} font-medium`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </div>
  )
}
