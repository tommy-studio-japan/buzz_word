"use client"

import Link from "next/link"
import { ArrowUp, ArrowRight, ArrowDown, AlertTriangle, TrendingDown } from "lucide-react"
import { ExpiryStatusBadge } from "./expiry-status-badge"

type BuzzwordItem = {
  id: string
  keyword: string
  streamers: string[]
  profitScore: number
  trend: "up" | "stable" | "down"
  clipCount: number
  avgViews: number
  expiryStatus?: "FRESH" | "FADING" | "EXPIRED" | "OVERUSED"
  expiryWarning?: string
  daysSincePeak?: number
  recentGrowth?: number
}

type BuzzwordTableProps = {
  buzzwords: BuzzwordItem[]
}

export function BuzzwordTable({ buzzwords }: BuzzwordTableProps) {
  const getTrendIcon = (trend: "up" | "stable" | "down") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-accent" />
      case "down":
        return <ArrowDown className="w-4 h-4 text-muted-foreground" />
      default:
        return <ArrowRight className="w-4 h-4 text-secondary" />
    }
  }

  const getTrendLabel = (trend: "up" | "stable" | "down") => {
    switch (trend) {
      case "up":
        return "急上昇"
      case "down":
        return "下降"
      default:
        return "安定"
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">順位</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">キーワード</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">配信者</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">儲かりやすさ</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">トレンド</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">状態</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">クリップ数</th>
            </tr>
          </thead>
          <tbody>
            {buzzwords.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  item.expiryStatus === "EXPIRED" ? "opacity-60" : ""
                }`}
              >
                <td className="py-4 px-4">
                  <span className="text-muted-foreground font-medium">{index + 1}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <Link
                      href={`/insights/buzzwords/${encodeURIComponent(item.keyword)}`}
                      className="text-primary hover:underline font-medium block"
                    >
                      {item.keyword}
                    </Link>
                    {item.expiryWarning && (
                      <div className="flex items-center gap-1.5 text-xs">
                        {item.expiryStatus === "EXPIRED" ? (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-yellow-500" />
                        )}
                        <span className={item.expiryStatus === "EXPIRED" ? "text-red-500" : "text-yellow-500"}>
                          {item.expiryWarning}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.streamers.slice(0, 2).map((streamer, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        {streamer}
                      </span>
                    ))}
                    {item.streamers.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{item.streamers.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${item.profitScore}%` }}
                      />
                    </div>
                    <span className="font-semibold text-foreground min-w-[3ch]">{item.profitScore}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1">
                    {getTrendIcon(item.trend)}
                    <span className="text-sm text-muted-foreground">{getTrendLabel(item.trend)}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    {item.expiryStatus && <ExpiryStatusBadge status={item.expiryStatus} size="sm" />}
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-muted-foreground">{item.clipCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
