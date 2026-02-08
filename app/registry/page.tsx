"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trpc } from "@/lib/trpc"

type Option = { value: string; label: string }

export default function RegistryPage() {
  const utils = trpc.useUtils()
  const { data: streamers = [], isLoading: isLoadingStreamers } = trpc.streamers.list.useQuery({
    limit: 200,
  })
  const { data: channels = [], isLoading: isLoadingChannels } = trpc.channels.list.useQuery({
    limit: 200,
  })

  const streamerOptions: Option[] = useMemo(
    () =>
      streamers.map((s) => ({
        value: s.id,
        label: s.group ? `${s.streamerName} (${s.group})` : s.streamerName,
      })),
    [streamers],
  )

  const [streamerName, setStreamerName] = useState("")
  const [streamerGroup, setStreamerGroup] = useState("")
  const [streamerAvatarUrl, setStreamerAvatarUrl] = useState("")
  const [streamerMsg, setStreamerMsg] = useState<string | null>(null)
  const [youtubeLink, setYoutubeLink] = useState("")
  const [autoFillMsg, setAutoFillMsg] = useState<string | null>(null)

  const [platform, setPlatform] = useState("youtube")
  const [platformChannelId, setPlatformChannelId] = useState("")
  const [channelName, setChannelName] = useState("")
  const [handleName, setHandleName] = useState("")
  const [channelAvatarUrl, setChannelAvatarUrl] = useState("")
  const [streamerId, setStreamerId] = useState("")
  const [channelMsg, setChannelMsg] = useState<string | null>(null)

  const createStreamer = trpc.streamers.create.useMutation({
    onSuccess: () => {
      setStreamerMsg("streamer を登録しました。")
      setStreamerName("")
      setStreamerGroup("")
      setStreamerAvatarUrl("")
      utils.streamers.list.invalidate()
    },
    onError: (err) => {
      setStreamerMsg(err.message || "streamer の登録に失敗しました。")
    },
  })

  const createChannel = trpc.channels.create.useMutation({
    onSuccess: () => {
      setChannelMsg("channel を登録しました。")
      setPlatformChannelId("")
      setChannelName("")
      setHandleName("")
      setChannelAvatarUrl("")
      utils.channels.list.invalidate()
    },
    onError: (err) => {
      setChannelMsg(err.message || "channel の登録に失敗しました。")
    },
  })

  const resolveChannel = trpc.youtube.resolveChannelFromVideoUrl.useMutation({
    onSuccess: (data) => {
      setAutoFillMsg("YouTube から情報を取得しました。")
      setPlatform(data.platform)
      setPlatformChannelId(data.platformChannelId ?? "")
      setChannelName(data.channelName ?? "")
      setHandleName(data.handleName ?? "")
      setChannelAvatarUrl(data.avatarUrl ?? "")
      if (data.streamerName) {
        setStreamerName(data.streamerName)
      }
      if (data.avatarUrl) {
        setStreamerAvatarUrl(data.avatarUrl)
      }
    },
    onError: (err) => {
      setAutoFillMsg(err.message || "YouTube からの取得に失敗しました。")
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-5xl">
            <h1 className="text-2xl font-bold">Streamers / Channels 登録</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              解析や取り込みで使用する streamer と channel を手動登録します。
            </p>
            <div className="mt-4">
              <Label htmlFor="youtube-link" className="text-sm">
                追加したい youtuber の動画リンク
              </Label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Input
                  id="youtube-link"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  disabled={!youtubeLink.trim() || resolveChannel.isPending}
                  onClick={() => {
                    setAutoFillMsg(null)
                    resolveChannel.mutate({ url: youtubeLink.trim() })
                  }}
                >
                  {resolveChannel.isPending ? "取得中..." : "自動入力"}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                追加したい youtuber の動画リンクを貼るといくつかの項目が自動で追加されます
              </p>
              {autoFillMsg ? <p className="mt-2 text-xs text-muted-foreground">{autoFillMsg}</p> : null}
            </div>

            <div className="mt-6">
              <Tabs defaultValue="streamers" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="streamers" className="flex-1">
                    Streamers
                  </TabsTrigger>
                  <TabsTrigger value="channels" className="flex-1">
                    Channels
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="streamers" className="mt-4">
                  <Card className="bg-card p-6">
                    <h2 className="text-lg font-semibold">Streamer 登録</h2>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="streamer-name">名前</Label>
                        <Input
                          id="streamer-name"
                          value={streamerName}
                          onChange={(e) => setStreamerName(e.target.value)}
                          placeholder="例: 叶"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="streamer-group">所属 (任意)</Label>
                        <Input
                          id="streamer-group"
                          value={streamerGroup}
                          onChange={(e) => setStreamerGroup(e.target.value)}
                          placeholder="例: NIJISANJI JP"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="streamer-avatar">アバターURL (任意)</Label>
                        <Input
                          id="streamer-avatar"
                          value={streamerAvatarUrl}
                          onChange={(e) => setStreamerAvatarUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      {streamerMsg ? (
                        <p className="text-sm text-muted-foreground">{streamerMsg}</p>
                      ) : null}
                      <Button
                        disabled={createStreamer.isPending || !streamerName.trim()}
                        onClick={() => {
                          setStreamerMsg(null)
                          createStreamer.mutate({
                            streamerName: streamerName.trim(),
                            group: streamerGroup.trim() || null,
                            avatarUrl: streamerAvatarUrl.trim() || null,
                          })
                        }}
                      >
                        {createStreamer.isPending ? "登録中..." : "Streamer を登録"}
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="channels" className="mt-4">
                  <Card className="bg-card p-6">
                    <h2 className="text-lg font-semibold">Channel 登録</h2>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="channel-platform">Platform</Label>
                        <Input
                          id="channel-platform"
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                          placeholder="youtube"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="channel-platform-id">Platform Channel ID</Label>
                        <Input
                          id="channel-platform-id"
                          value={platformChannelId}
                          onChange={(e) => setPlatformChannelId(e.target.value)}
                          placeholder="例: UCxxxxxxxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="channel-name">チャンネル名</Label>
                        <Input
                          id="channel-name"
                          value={channelName}
                          onChange={(e) => setChannelName(e.target.value)}
                          placeholder="例: Kanae Channel"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="channel-handle">Handle (任意)</Label>
                        <Input
                          id="channel-handle"
                          value={handleName}
                          onChange={(e) => setHandleName(e.target.value)}
                          placeholder="@kanae"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="channel-avatar">アバターURL (任意)</Label>
                        <Input
                          id="channel-avatar"
                          value={channelAvatarUrl}
                          onChange={(e) => setChannelAvatarUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="channel-streamer">Streamer</Label>
                        <select
                          id="channel-streamer"
                          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                          value={streamerId}
                          onChange={(e) => setStreamerId(e.target.value)}
                        >
                          <option value="">選択してください</option>
                          {streamerOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {isLoadingStreamers ? (
                          <p className="text-xs text-muted-foreground">streamer を読み込み中...</p>
                        ) : null}
                      </div>
                      {channelMsg ? (
                        <p className="text-sm text-muted-foreground">{channelMsg}</p>
                      ) : null}
                      <Button
                        disabled={
                          createChannel.isPending ||
                          !platform.trim() ||
                          !platformChannelId.trim() ||
                          !channelName.trim() ||
                          !streamerId
                        }
                        onClick={() => {
                          setChannelMsg(null)
                          createChannel.mutate({
                            platform: platform.trim(),
                            platformChannelId: platformChannelId.trim(),
                            channelName: channelName.trim(),
                            handleName: handleName.trim() || null,
                            avatarUrl: channelAvatarUrl.trim() || null,
                            streamerId,
                          })
                        }}
                      >
                        {createChannel.isPending ? "登録中..." : "Channel を登録"}
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <Card className="mt-6 bg-card p-6">
              <h2 className="text-lg font-semibold">登録済み</h2>
              <div className="mt-3 space-y-2 text-sm">
                {isLoadingChannels ? (
                  <p className="text-muted-foreground">読み込み中...</p>
                ) : channels.length === 0 ? (
                  <p className="text-muted-foreground">まだ登録がありません。</p>
                ) : (
                  channels.map((c) => (
                    <div key={c.id} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{c.channelName ?? "Unnamed Channel"}</span>
                        <span className="text-xs text-muted-foreground">{c.platform}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {c.handleName ? `${c.handleName} · ` : ""}
                        {c.platformChannelId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {c.streamerName ?? "Unknown Streamer"}
                        {c.group ? ` (${c.group})` : ""}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
