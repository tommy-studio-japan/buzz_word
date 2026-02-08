"use client"

import { Home, Heart, Tv, List, Grid3x3, Music, Info, Settings, TrendingUp,FileVideo } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "ホーム", href: "/" },
  { icon: FileVideo, label: "動画分析", href: "video-analyze"},
  { icon: Heart, label: "お気に入り", href: "/favorites" },
  { icon: Tv, label: "チャンネル", href: "/channels" },
  { icon: List, label: "プレイリスト", href: "/playlists" },
  { icon: Grid3x3, label: "マルチビュー", href: "/multiview" },
  { icon: Music, label: "Musicdex", href: "/musicdex" },
  { icon: TrendingUp, label: "バズワード", href: "/insights/buzzwords" },
  { icon: Settings, label: "登録", href: "/registry" },
  { icon: Info, label: "案内", href: "/about" },
  { icon: Settings, label: "設定", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors relative",
                isActive ? "text-sidebar-primary bg-sidebar-accent" : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />}
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
