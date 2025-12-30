"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === tab.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {tab.count}
            </Badge>
          )}
        </button>
      ))}
    </div>
  )
}
