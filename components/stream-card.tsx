import { Eye, Clock } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export interface StreamCardProps {
  id: string
  title: string
  thumbnailUrl: string
  channelName: string
  channelAvatar: string
  group: string
  status: "live" | "scheduled" | "archive"
  viewerCount?: number
  scheduledTime?: string
  duration?: string
  gameTag?: string
}

export function StreamCard({
  id,
  title,
  thumbnailUrl,
  channelName,
  channelAvatar,
  group,
  status,
  viewerCount,
  scheduledTime,
  duration,
  gameTag,
}: StreamCardProps) {
  return (
    <Link href={`/watch/${id}`}>
      <Card className="bg-card overflow-hidden transition-transform hover:scale-105 h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted">
          <img src={thumbnailUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />

          {/* Overlays */}
          {gameTag && (
            <Badge className="absolute top-2 left-2 bg-background/80 text-foreground text-xs">{gameTag}</Badge>
          )}
          {duration && (
            <Badge className="absolute bottom-2 right-2 bg-background/90 text-foreground text-xs">{duration}</Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="text-sm font-medium line-clamp-2 leading-snug">{title}</h3>

          {/* Channel */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={channelAvatar || "/placeholder.svg"} />
              <AvatarFallback>{channelName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground truncate">{channelName}</p>
              <p className="text-xs text-secondary truncate">{group}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 text-xs">
            {status === "live" && (
              <>
                <Badge className="bg-accent text-accent-foreground">2</Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span>{viewerCount?.toLocaleString()}</span>
                </div>
              </>
            )}
            {status === "scheduled" && (
              <>
                <Badge variant="outline">配信予定</Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{scheduledTime}</span>
                </div>
              </>
            )}
            {status === "archive" && <Badge variant="secondary">アーカイブ</Badge>}
          </div>
        </div>
      </Card>
    </Link>
  )
}
