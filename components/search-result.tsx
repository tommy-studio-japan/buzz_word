import { Play, Bookmark } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface SearchResultProps {
  id: string
  streamTitle: string
  channelName: string
  channelAvatar: string
  thumbnailUrl: string
  timestamp: string
  transcriptText: string
  matchedText: string
}

export function SearchResult({
  id,
  streamTitle,
  channelName,
  channelAvatar,
  thumbnailUrl,
  timestamp,
  transcriptText,
  matchedText,
}: SearchResultProps) {
  // Highlight matched text
  const highlightText = (text: string, match: string) => {
    const parts = text.split(new RegExp(`(${match})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark key={i} className="bg-primary/30 text-foreground font-medium">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <Card className="bg-card p-4">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <Link href={`/watch/${id}?t=${timestamp.replace(/:/g, "")}`} className="flex-shrink-0">
          <div className="w-40 aspect-video bg-muted rounded overflow-hidden relative group">
            <img src={thumbnailUrl || "/placeholder.svg"} alt={streamTitle} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Title and Channel */}
          <div>
            <Link
              href={`/watch/${id}`}
              className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
            >
              {streamTitle}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="w-5 h-5">
                <AvatarImage src={channelAvatar || "/placeholder.svg"} />
                <AvatarFallback>{channelName[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{channelName}</span>
            </div>
          </div>

          {/* Transcript */}
          <p className="text-sm text-foreground leading-relaxed">{highlightText(transcriptText, matchedText)}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="default">
              <Link href={`/watch/${id}?t=${timestamp.replace(/:/g, "")}`}>
                <Play className="w-3 h-3 mr-1" />
                {timestamp}
              </Link>
            </Button>
            <Button size="sm" variant="outline">
              <Bookmark className="w-3 h-3 mr-1" />
              クリップ保存
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
