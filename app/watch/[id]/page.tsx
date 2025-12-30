"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { TranscriptList } from "@/components/transcript-list"
import { ClipBuilder } from "@/components/clip-builder"
import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

// Mock transcript data
const mockTranscripts = [
  { id: 1, timestamp: "0:00:15", text: "配信を始めます！今日もよろしくお願いします。" },
  { id: 2, timestamp: "0:02:30", text: "今日はストリートファイター6のランクマッチをやっていきます。" },
  { id: 3, timestamp: "0:05:45", text: "このキャラクターは使いやすいですね。コンボも覚えやすいです。" },
  { id: 4, timestamp: "0:12:20", text: "相手が強い！でも負けないように頑張ります。" },
  { id: 5, timestamp: "0:18:30", text: "このコンボは本当に強いですね。相手のガードを崩すための重要なテクニックです。" },
  {
    id: 6,
    timestamp: "0:25:10",
    text: "タイミングが大事なので練習が必要ですが、マスターすれば試合を有利に進められます。",
  },
  { id: 7, timestamp: "0:32:45", text: "勝った！やっと勝てました。嬉しいです！" },
  { id: 8, timestamp: "0:40:15", text: "次の試合も頑張ります。目標はダイヤランクです。" },
  { id: 9, timestamp: "0:48:30", text: "フレーム有利の状況を作ることが重要です。" },
  { id: 10, timestamp: "0:55:20", text: "相手の行動を読んで、適切な技を出すことで、確実にダメージを取れます。" },
  { id: 11, timestamp: "1:02:45", text: "今日の配信はここまでです。見てくれてありがとうございました！" },
]

function WatchContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const [selectedStartTime, setSelectedStartTime] = useState<string>("")
  const [selectedEndTime, setSelectedEndTime] = useState<string>("")
  const timestampParam = searchParams.get("t")

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-xl font-bold">【STREET FIGHTER 6】ランクマッチで上を目指す配信</h1>
              <p className="text-sm text-muted-foreground mt-1">叶 - [NIJISANJI JP]</p>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Video Player */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-card overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Play className="w-8 h-8 text-primary fill-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Video Player Placeholder</p>
                      {timestampParam && <p className="text-xs text-muted-foreground">Starting at: {timestampParam}</p>}
                    </div>
                  </div>
                </Card>

                {/* Clip Builder */}
                <ClipBuilder
                  startTime={selectedStartTime}
                  endTime={selectedEndTime}
                  onStartTimeChange={setSelectedStartTime}
                  onEndTimeChange={setSelectedEndTime}
                />
              </div>

              {/* Right: Transcript */}
              <div className="lg:col-span-1">
                <TranscriptList
                  transcripts={mockTranscripts}
                  onTimestampClick={(timestamp) => {
                    if (!selectedStartTime) {
                      setSelectedStartTime(timestamp)
                    } else if (!selectedEndTime) {
                      setSelectedEndTime(timestamp)
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <WatchContent id={id} />
      </Suspense>
    </div>
  )
}
