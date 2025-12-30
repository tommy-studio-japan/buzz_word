"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Eye, Volume2, Monitor } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoplay, setAutoplay] = useState(false)
  const [qualityAuto, setQualityAuto] = useState(true)
  const [showChat, setShowChat] = useState(true)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">設定</h1>
            </div>

            <div className="space-y-6">
              {/* 通知設定 */}
              <Card className="bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">通知設定</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="notifications">配信開始通知</Label>
                      <p className="text-sm text-muted-foreground">お気に入りのライバーが配信を開始したら通知</p>
                    </div>
                    <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="schedule-notifications">配信予定通知</Label>
                      <p className="text-sm text-muted-foreground">配信予定の15分前に通知</p>
                    </div>
                    <Switch id="schedule-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="clip-notifications">切り抜き通知</Label>
                      <p className="text-sm text-muted-foreground">保存した切り抜きが処理完了したら通知</p>
                    </div>
                    <Switch id="clip-notifications" />
                  </div>
                </div>
              </Card>

              {/* 再生設定 */}
              <Card className="bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Volume2 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">再生設定</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="autoplay">自動再生</Label>
                      <p className="text-sm text-muted-foreground">次の動画を自動的に再生</p>
                    </div>
                    <Switch id="autoplay" checked={autoplay} onCheckedChange={setAutoplay} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="quality">画質自動調整</Label>
                      <p className="text-sm text-muted-foreground">ネットワーク状況に応じて画質を調整</p>
                    </div>
                    <Switch id="quality" checked={qualityAuto} onCheckedChange={setQualityAuto} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="muted-autoplay">ミュート自動再生</Label>
                      <p className="text-sm text-muted-foreground">自動再生時は音声をミュート</p>
                    </div>
                    <Switch id="muted-autoplay" />
                  </div>
                </div>
              </Card>

              {/* 表示設定 */}
              <Card className="bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">表示設定</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="show-chat">チャット表示</Label>
                      <p className="text-sm text-muted-foreground">視聴ページでチャットを表示</p>
                    </div>
                    <Switch id="show-chat" checked={showChat} onCheckedChange={setShowChat} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="show-thumbnails">サムネイル表示</Label>
                      <p className="text-sm text-muted-foreground">一覧でサムネイルを表示</p>
                    </div>
                    <Switch id="show-thumbnails" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="compact-mode">コンパクト表示</Label>
                      <p className="text-sm text-muted-foreground">リストを詰めて表示</p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                </div>
              </Card>

              {/* システム設定 */}
              <Card className="bg-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Monitor className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">システム</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>言語</Label>
                    <select className="w-full mt-2 px-3 py-2 bg-background border border-input rounded-md">
                      <option>日本語</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div>
                    <Label>タイムゾーン</Label>
                    <select className="w-full mt-2 px-3 py-2 bg-background border border-input rounded-md">
                      <option>Asia/Tokyo (UTC+9)</option>
                      <option>America/New_York (UTC-5)</option>
                      <option>Europe/London (UTC+0)</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* アクションボタン */}
              <div className="flex gap-4">
                <Button className="flex-1">変更を保存</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
