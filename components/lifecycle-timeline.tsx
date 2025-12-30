"use client"

type LifecycleTimelineProps = {
  peakDate: string
  currentStatus: string
  daysSincePeak: number
}

export function LifecycleTimeline({ peakDate, currentStatus, daysSincePeak }: LifecycleTimelineProps) {
  const stages = [
    { label: "Rise", status: "completed" },
    { label: "Peak", status: "completed", date: peakDate },
    { label: "Decay", status: currentStatus === "EXPIRED" || currentStatus === "FADING" ? "current" : "pending" },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">ライフサイクル</h3>
        <p className="text-sm text-muted-foreground">このキーワードの現在の状態を表しています</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />

        {/* Stages */}
        <div className="relative flex justify-between">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              {/* Node */}
              <div
                className={`w-12 h-12 rounded-full border-4 flex items-center justify-center relative z-10 ${
                  stage.status === "completed"
                    ? "bg-green-500 border-green-500"
                    : stage.status === "current"
                      ? "bg-yellow-500 border-yellow-500 animate-pulse"
                      : "bg-muted border-border"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    stage.status === "completed" || stage.status === "current" ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </span>
              </div>

              {/* Label */}
              <div className="text-center space-y-1">
                <p
                  className={`text-sm font-medium ${
                    stage.status === "current"
                      ? "text-yellow-500"
                      : stage.status === "completed"
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </p>
                {stage.date && <p className="text-xs text-muted-foreground">{stage.date}</p>}
                {stage.status === "current" && <p className="text-xs text-yellow-500 font-medium">← You are here</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current status indicator */}
      <div className="bg-card/50 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">現在の状態</p>
            <p className="text-xs text-muted-foreground mt-1">ピークから{daysSincePeak}日経過</p>
          </div>
          <div
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentStatus === "EXPIRED"
                ? "bg-red-500/10 text-red-500"
                : currentStatus === "FADING"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-green-500/10 text-green-500"
            }`}
          >
            {currentStatus === "EXPIRED" ? "賞味期限切れ" : currentStatus === "FADING" ? "下降中" : "ピーク中"}
          </div>
        </div>
      </div>
    </div>
  )
}
