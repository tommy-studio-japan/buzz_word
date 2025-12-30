"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, X } from "lucide-react"

interface ClipBuilderProps {
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
}

export function ClipBuilder({ startTime, endTime, onStartTimeChange, onEndTimeChange }: ClipBuilderProps) {
  const [memo, setMemo] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = () => {
    console.log("Saving clip:", { startTime, endTime, memo, tags })
    // TODO: Implement save logic
    alert("クリップを保存しました！")
  }

  return (
    <Card className="bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">クリップ候補作成</h3>

      <div className="space-y-4">
        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time" className="text-xs">
              開始時間
            </Label>
            <Input
              id="start-time"
              type="text"
              placeholder="0:00:00"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time" className="text-xs">
              終了時間
            </Label>
            <Input
              id="end-time"
              type="text"
              placeholder="0:00:00"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Memo */}
        <div className="space-y-2">
          <Label htmlFor="memo" className="text-xs">
            メモ
          </Label>
          <Textarea
            id="memo"
            placeholder="クリップの内容をメモ..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="min-h-[80px] text-sm resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-xs">
            タグ
          </Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              type="text"
              placeholder="タグを入力..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              className="h-9 text-sm"
            />
            <Button type="button" size="sm" onClick={handleAddTag}>
              追加
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full" disabled={!startTime || !endTime}>
          <Save className="w-4 h-4 mr-2" />
          クリップ候補を保存
        </Button>
      </div>
    </Card>
  )
}
