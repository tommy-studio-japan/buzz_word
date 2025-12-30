"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Transcript {
  id: number
  timestamp: string
  text: string
}

interface TranscriptListProps {
  transcripts: Transcript[]
  onTimestampClick: (timestamp: string) => void
}

export function TranscriptList({ transcripts, onTimestampClick }: TranscriptListProps) {
  return (
    <Card className="bg-card p-4 h-[600px] flex flex-col">
      <h3 className="text-sm font-semibold mb-3">トランスクリプト</h3>
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {transcripts.map((transcript) => (
            <div key={transcript.id} className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTimestampClick(transcript.timestamp)}
                className="h-auto w-full justify-start p-2 hover:bg-primary/10"
              >
                <div className="text-left space-y-1 w-full">
                  <div className="text-xs font-mono text-primary">{transcript.timestamp}</div>
                  <p className="text-xs text-foreground leading-relaxed">{transcript.text}</p>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}
