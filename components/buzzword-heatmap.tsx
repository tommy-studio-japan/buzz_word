"use client"

import { useState } from "react"

type HeatmapCell = {
  date: string
  streamer: string
  frequency: number
  avgViews: number
  engagement: number
  intensity: number
}

type BuzzwordHeatmapProps = {
  data: HeatmapCell[]
  keyword: string
}

export function BuzzwordHeatmap({ data, keyword }: BuzzwordHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null)

  // Get unique streamers and dates
  const streamers = Array.from(new Set(data.map((d) => d.streamer)))
  const dates = Array.from(
    new Set(data.map((d) => new Date(d.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" }))),
  )
    .slice(0, 14)
    .reverse()

  const getCellData = (streamer: string, date: string) => {
    return data.find(
      (d) =>
        d.streamer === streamer &&
        new Date(d.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" }) === date,
    )
  }

  const getHeatColor = (intensity: number) => {
    if (intensity === 0) return "bg-muted/30"
    if (intensity < 0.3) return "bg-primary/20"
    if (intensity < 0.6) return "bg-primary/50"
    if (intensity < 0.8) return "bg-primary/70"
    return "bg-accent"
  }

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-2">
            {/* Streamer labels */}
            <div className="flex flex-col gap-1 pt-8">
              {streamers.map((streamer) => (
                <div key={streamer} className="h-12 flex items-center justify-end pr-2 text-sm text-muted-foreground">
                  {streamer}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex-1">
              {/* Date labels */}
              <div className="flex gap-1 mb-1">
                {dates.map((date) => (
                  <div key={date} className="w-12 text-xs text-center text-muted-foreground">
                    {date}
                  </div>
                ))}
              </div>

              {/* Cells */}
              {streamers.map((streamer) => (
                <div key={streamer} className="flex gap-1 mb-1">
                  {dates.map((date) => {
                    const cellData = getCellData(streamer, date)
                    const intensity = cellData?.intensity || 0

                    return (
                      <div
                        key={`${streamer}-${date}`}
                        className={`w-12 h-12 rounded ${getHeatColor(intensity)} transition-all duration-200 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-primary relative`}
                        onMouseEnter={() => cellData && setHoveredCell(cellData)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {cellData && cellData.frequency > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                            {cellData.frequency}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="absolute top-0 right-0 bg-card border border-border rounded-lg p-4 shadow-lg z-10 min-w-[250px]">
          <div className="space-y-2">
            <div className="font-medium text-foreground">{hoveredCell.streamer}</div>
            <div className="text-sm text-muted-foreground">
              キーワード: <span className="text-primary">{keyword}</span>
            </div>
            <div className="text-sm text-muted-foreground">出現回数: {hoveredCell.frequency}回</div>
            <div className="text-sm text-muted-foreground">平均視聴数: {hoveredCell.avgViews.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">
              エンゲージメント: {(hoveredCell.engagement * 100).toFixed(1)}%
            </div>
            <button className="w-full mt-2 px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors">
              検索結果を見る
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>出現頻度:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/30" />
          <span>低</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/50" />
          <span>中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent" />
          <span>高</span>
        </div>
      </div>
    </div>
  )
}
