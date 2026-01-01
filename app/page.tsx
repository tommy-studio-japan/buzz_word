"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Tabs } from "@/components/tabs"
import { StreamCard } from "@/components/stream-card"
import { trpc } from "@/lib/trpc"


// Mock data for demonstration
const mockStreams = [
  {
    id: "1",
    title: "【STREET FIGHTER 6】ランクマッチで上を目指す配信",
    thumbnailUrl: "/street-fighter-gameplay.jpg",
    channelName: "叶",
    channelAvatar: "/anime-avatar.png",
    group: "[NIJISANJI JP]",
    status: "live" as const,
    viewerCount: 12543,
    gameTag: "Street_Fighter",
    duration: "4:15:00",
  },
  {
    id: "2",
    title: "【雑談】最近のこと話す！",
    thumbnailUrl: "/anime-vtuber-talking.jpg",
    channelName: "Elira Pendora",
    channelAvatar: "/anime-avatar-girl.jpg",
    group: "[NIJISANJI EN]",
    status: "live" as const,
    viewerCount: 8234,
    duration: "2:30:15",
  },
  {
    id: "3",
    title: "【Minecraft】新しい建築プロジェクト開始",
    thumbnailUrl: "/minecraft-building.png",
    channelName: "月ノ美兎",
    channelAvatar: "/anime-avatar-girl-pink.jpg",
    group: "[NIJISANJI JP]",
    status: "live" as const,
    viewerCount: 15678,
    gameTag: "Minecraft",
    duration: "1:45:30",
  },
  {
    id: "4",
    title: "【歌枠】深夜の歌配信",
    thumbnailUrl: "/singing-karaoke-vtuber.jpg",
    channelName: "Petra Gurin",
    channelAvatar: "/anime-avatar-girl-blue.jpg",
    group: "[NIJISANJI EN]",
    status: "live" as const,
    viewerCount: 6543,
    duration: "3:20:00",
  },
  {
    id: "5",
    title: "【Apex Legends】ランク上げ配信",
    thumbnailUrl: "/apex-legends-gameplay.jpg",
    channelName: "渋谷ハル",
    channelAvatar: "/anime-avatar-boy.png",
    group: "[NIJISANJI JP]",
    status: "live" as const,
    viewerCount: 20123,
    gameTag: "Apex_Legends",
    duration: "5:10:00",
  },
  {
    id: "6",
    title: "【ホラーゲーム】初見プレイ",
    thumbnailUrl: "/horror-game-dark.jpg",
    channelName: "Vox Akuma",
    channelAvatar: "/anime-avatar-boy-red.jpg",
    group: "[NIJISANJI EN]",
    status: "live" as const,
    viewerCount: 11234,
    gameTag: "Horror",
    duration: "2:05:30",
  },
  {
    id: "7",
    title: "【お絵描き】リスナーのリクエスト描く",
    thumbnailUrl: "/digital-art-drawing.jpg",
    channelName: "戌亥とこ",
    channelAvatar: "/anime-avatar-girl-white.jpg",
    group: "[NIJISANJI JP]",
    status: "live" as const,
    viewerCount: 5678,
    duration: "1:30:00",
  },
  {
    id: "8",
    title: "【料理配信】今日の夕飯作る",
    thumbnailUrl: "/cooking-kitchen.png",
    channelName: "Enna Alouette",
    channelAvatar: "/anime-avatar-girl-purple.jpg",
    group: "[NIJISANJI EN]",
    status: "live" as const,
    viewerCount: 7890,
    duration: "0:45:20",
  },
]

const tabs = [
  { id: "live", label: "配信中", count: 36 },
  { id: "scheduled", label: "配信予定", count: 112 },
  { id: "archive", label: "アーカイブ" },
  { id: "clips", label: "切り抜き" },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("live")
  /** [memo]
   *  なぜtrpc.streamsは/server/api/root.tsを示すのか？
   *   👉trpc.streams は「サーバーで定義した tRPC router の“型”を反映している」からです。
   *  なぜtrpc だけだと lib/trpc.ts を示すのか？
   *   👉 はい。trpc はクライアント側の“型付き API クライアント”の定義で、実体は lib/trpc.ts にあります。
   * 
[ server/api/root.ts ]
  └─ appRouter
      ├─ streams
      │    └─ list
      └─ channels
           └─ list
        ▲
        │（型）
        │
[ lib/trpc.ts ]
  └─ createTRPCReact<AppRouter>()
        ▲
        │
[ page.tsx ]
  └─ trpc.streams.list.useQuery()

  重要なのは👇
**「実装は server、型は client に流れてくる」**という一方向性です。

*/
  const { data: streams = [], isLoading, error } = trpc.streams.list.useQuery({
    limit: 24,
  })
  const formatDuration = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600)
    const minutes = Math.floor((totalSec % 3600) / 60)
    const seconds = totalSec % 60
    const pad = (value: number) => value.toString().padStart(2, "0")

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`
    }
    return `${minutes}:${pad(seconds)}`
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockStreams.map((stream) => (
                <StreamCard key={stream.id} {...stream} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <div>
        {isLoading && <div className="p-6 text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="p-6 text-sm text-destructive">Failed to load streams.</div>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {streams.map((s) => (
              <StreamCard
                key={s.id}
                id={s.id}
                title={s.title ?? "Untitled"}
                thumbnailUrl={s.thumbnailUrl ?? "/placeholder.svg"}
                channelName={s.channelName ?? "Unknown"}
                channelAvatar={s.channelAvatar ?? "/placeholder.svg"}
                group={s.group ?? ""}
                status={s.status ?? "archive"}
                viewerCount={s.viewerCountMax ?? s.viewerCountAverage ?? undefined}
                scheduledTime={s.scheduledTime ?? undefined}
                duration={s.durationSec ? formatDuration(s.durationSec) : undefined}
                gameTag={s.gameTag ?? undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
