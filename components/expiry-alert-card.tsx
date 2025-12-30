import { AlertTriangle, TrendingDown, Users, Calendar } from "lucide-react"
import Link from "next/link"

type ExpiryAlertCardProps = {
  keyword: string
  peakDate: string
  daysSincePeak: number
  recentGrowth: number
  clipSuccessRate: number
  status: string
  alternatives: {
    relatedKeywords: string[]
    differentAngles: string[]
    freshKeywords: string[]
  }
}

export function ExpiryAlertCard({
  keyword,
  peakDate,
  daysSincePeak,
  recentGrowth,
  clipSuccessRate,
  status,
  alternatives,
}: ExpiryAlertCardProps) {
  const isExpired = status === "EXPIRED" || status === "OVERUSED"

  if (!isExpired && status !== "FADING") {
    return null
  }

  return (
    <div
      className={`rounded-lg border p-6 space-y-4 ${
        status === "EXPIRED"
          ? "bg-red-500/5 border-red-500/30"
          : status === "FADING"
            ? "bg-yellow-500/5 border-yellow-500/30"
            : "bg-muted/50 border-border"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${status === "EXPIRED" ? "bg-red-500/10" : status === "FADING" ? "bg-yellow-500/10" : "bg-muted"}`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${status === "EXPIRED" ? "text-red-500" : status === "FADING" ? "text-yellow-500" : "text-muted-foreground"}`}
          />
        </div>
        <div className="flex-1 space-y-1">
          <h2
            className={`text-xl font-bold ${status === "EXPIRED" ? "text-red-500" : status === "FADING" ? "text-yellow-500" : "text-foreground"}`}
          >
            {status === "EXPIRED" ? "このワードは賞味期限切れです" : "このワードは下降傾向にあります"}
          </h2>
          <p className="text-sm text-muted-foreground">切り抜いても伸びにくい可能性があります</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card/50 rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium">ピーク日</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{peakDate}</p>
          <p className="text-xs text-muted-foreground mt-1">{daysSincePeak}日前</p>
        </div>

        <div className="bg-card/50 rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-medium">直近再生数</span>
          </div>
          <p className={`text-lg font-semibold ${recentGrowth < 0 ? "text-red-500" : "text-yellow-500"}`}>
            {recentGrowth > 0 ? "+" : ""}
            {(recentGrowth * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">前週比</p>
        </div>

        <div className="bg-card/50 rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">成功率</span>
          </div>
          <p className={`text-lg font-semibold ${clipSuccessRate < 0.15 ? "text-red-500" : "text-yellow-500"}`}>
            {(clipSuccessRate * 100).toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">1000回再生以上</p>
        </div>
      </div>

      {/* Reason Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">なぜ賞味期限切れなのか？</h3>
        <ul className="space-y-2">
          {recentGrowth < -0.2 && (
            <li className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5">•</span>
              <span className="text-muted-foreground">
                再生数が急減しています（前週比{(recentGrowth * 100).toFixed(0)}%）
              </span>
            </li>
          )}
          {clipSuccessRate < 0.15 && (
            <li className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5">•</span>
              <span className="text-muted-foreground">
                最近の切り抜き成功率が低い（{(clipSuccessRate * 100).toFixed(0)}%）
              </span>
            </li>
          )}
          {daysSincePeak > 7 && (
            <li className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5">•</span>
              <span className="text-muted-foreground">ピークから{daysSincePeak}日経過しています</span>
            </li>
          )}
          {status === "OVERUSED" && (
            <li className="flex items-start gap-2 text-sm">
              <span className="text-red-500 mt-0.5">•</span>
              <span className="text-muted-foreground">類似動画が急増しています（市場飽和）</span>
            </li>
          )}
        </ul>
      </div>

      {/* Alternative Suggestions */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground">代わりに狙うなら：</h3>

        <div className="space-y-3">
          {alternatives.relatedKeywords.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">関連ワード</p>
              <div className="flex flex-wrap gap-2">
                {alternatives.relatedKeywords.map((kw, idx) => (
                  <Link
                    key={idx}
                    href={`/insights/buzzwords/${encodeURIComponent(kw)}`}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm transition-colors"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {alternatives.differentAngles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">別角度のアプローチ</p>
              <div className="flex flex-wrap gap-2">
                {alternatives.differentAngles.map((angle, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-muted text-foreground border border-border rounded-lg text-sm"
                  >
                    {angle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {alternatives.freshKeywords.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">今Freshなワード</p>
              <div className="flex flex-wrap gap-2">
                {alternatives.freshKeywords.map((kw, idx) => (
                  <Link
                    key={idx}
                    href={`/insights/buzzwords/${encodeURIComponent(kw)}`}
                    className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg text-sm transition-colors"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
