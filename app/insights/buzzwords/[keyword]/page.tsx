import { BuzzwordHeatmap } from "@/components/buzzword-heatmap"
import { ExpiryAlertCard } from "@/components/expiry-alert-card"
import { LifecycleTimeline } from "@/components/lifecycle-timeline"
import { ArrowLeft, TrendingUp, Scissors, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data generation
const generateHeatmapData = () => {
  const streamers = ["花芽すみれ", "渋谷ハル", "笹木咲", "叶", "葛葉", "月ノ美兎"]
  const days = 14
  const data = []

  for (let day = 0; day < days; day++) {
    const date = new Date()
    date.setDate(date.getDate() - day)

    for (const streamer of streamers) {
      const frequency = Math.floor(Math.random() * 15)
      if (frequency > 2) {
        data.push({
          date: date.toISOString(),
          streamer,
          frequency,
          avgViews: Math.floor(5000 + Math.random() * 20000),
          engagement: Number.parseFloat((0.05 + Math.random() * 0.1).toFixed(2)),
          intensity: frequency / 15,
        })
      }
    }
  }

  return data
}

const calculateExpiryStatus = (keyword: string) => {
  // Mock expiry logic - simulating different statuses based on keyword
  const expiredKeywords = ["エモい", "やばい"]
  const fadingKeywords = ["建築バトル", "神回"]

  if (expiredKeywords.includes(keyword)) {
    return {
      status: "EXPIRED",
      peakDate: "2025-02-03",
      daysSincePeak: 9,
      recentGrowth: -0.62,
      clipSuccessRate: 0.08,
      decayRate: 0.75,
    }
  } else if (fadingKeywords.includes(keyword)) {
    return {
      status: "FADING",
      peakDate: "2025-02-08",
      daysSincePeak: 5,
      recentGrowth: -0.35,
      clipSuccessRate: 0.12,
      decayRate: 0.45,
    }
  }

  return {
    status: "FRESH",
    peakDate: "2025-02-12",
    daysSincePeak: 1,
    recentGrowth: 0.25,
    clipSuccessRate: 0.35,
    decayRate: 0.0,
  }
}

const getAlternatives = (keyword: string) => {
  // Mock alternatives based on keyword
  return {
    relatedKeywords: ["スーパープレイ", "ガチギレ", "神プレイ"],
    differentAngles: ["裏話", "初見リアクション", "NG集"],
    freshKeywords: ["コンボ", "ラスボス", "伝説の"],
  }
}

export default async function KeywordDetailPage({ params }: { params: Promise<{ keyword: string }> }) {
  const { keyword } = await params
  const decodedKeyword = decodeURIComponent(keyword)
  const heatmapData = generateHeatmapData()

  const expiryData = calculateExpiryStatus(decodedKeyword)
  const alternatives = getAlternatives(decodedKeyword)

  const topClips = [
    {
      id: "1",
      title: `【${decodedKeyword}】神プレイ集！`,
      streamer: "花芽すみれ",
      views: 45000,
      thumbnail: "/street-fighter-gameplay.jpg",
      timestamp: "2:34:15",
    },
    {
      id: "2",
      title: `${decodedKeyword}で大爆笑www`,
      streamer: "笹木咲",
      views: 32000,
      thumbnail: "/apex-legends-gameplay.jpg",
      timestamp: "1:15:30",
    },
    {
      id: "3",
      title: `伝説の${decodedKeyword}シーン`,
      streamer: "葛葉",
      views: 28000,
      thumbnail: "/minecraft-building.png",
      timestamp: "3:22:45",
    },
  ]

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back button */}
        <Link
          href="/insights/buzzwords"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          バズワード分析に戻る
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-foreground">{decodedKeyword}</h1>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold">
                {expiryData.status === "FRESH"
                  ? "急上昇中"
                  : expiryData.status === "FADING"
                    ? "下降中"
                    : "賞味期限切れ"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scissors className="w-4 h-4" />
              <span className="text-sm">234件のクリップ</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm">平均45,000回再生</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">エンゲージメント率 12%</span>
            </div>
          </div>
        </div>

        <ExpiryAlertCard
          keyword={decodedKeyword}
          peakDate={expiryData.peakDate}
          daysSincePeak={expiryData.daysSincePeak}
          recentGrowth={expiryData.recentGrowth}
          clipSuccessRate={expiryData.clipSuccessRate}
          status={expiryData.status}
          alternatives={alternatives}
        />

        {(expiryData.status === "FADING" || expiryData.status === "EXPIRED") && (
          <div className="bg-card rounded-lg border border-border p-6">
            <LifecycleTimeline
              peakDate={expiryData.peakDate}
              currentStatus={expiryData.status}
              daysSincePeak={expiryData.daysSincePeak}
            />
          </div>
        )}

        {/* Summary Section */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">キーワード概要</h2>
          <p className="text-muted-foreground leading-relaxed">
            「{decodedKeyword}
            」は現在、複数の配信者で頻繁に使用されており、視聴者のエンゲージメントが高い傾向にあります。特にゲーム配信において、プレイヤーの技術やリアクションを表現する際に多く使われています。
          </p>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">なぜ儲かりやすいのか？</h3>
            <ul className="space-y-2">
              {[
                "高いクリップ生成率（平均200件/週）",
                "視聴者のリアクションが良好（エンゲージメント率12%）",
                "複数の配信者で使用されており、トレンド性が高い",
                "直近2週間で成長率+25%を記録",
              ].map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">出現パターン</h2>
            <p className="text-sm text-muted-foreground">
              各配信者での「{decodedKeyword}」の出現頻度を時系列で表示しています。
            </p>
          </div>
          <BuzzwordHeatmap data={heatmapData} keyword={decodedKeyword} />
        </div>

        {/* Top Clips Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">このキーワードの人気クリップ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topClips.map((clip) => (
              <Link
                key={clip.id}
                href={`/watch/${clip.id}`}
                className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary transition-colors group"
              >
                <div className="relative aspect-video bg-muted">
                  <Image src={clip.thumbnail || "/placeholder.svg"} alt={clip.title} fill className="object-cover" />
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white">
                    {clip.timestamp}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {clip.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{clip.streamer}</span>
                    <span>{clip.views.toLocaleString()}回再生</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href={`/search?keyword=${encodeURIComponent(decodedKeyword)}`}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            このワードで切り抜く
          </Link>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
            関連する配信を探す
          </button>
        </div>
      </div>
    </div>
  )
}
