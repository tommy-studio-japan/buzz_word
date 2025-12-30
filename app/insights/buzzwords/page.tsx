// "use client"

// import { useState } from "react"
// import { BuzzwordTable } from "@/components/buzzword-table"
// import { Filter } from "lucide-react"

// const mockBuzzwords = [
//   {
//     id: "1",
//     keyword: "スーパープレイ",
//     streamers: ["花芽すみれ", "渋谷ハル"],
//     profitScore: 95,
//     trend: "up" as const,
//     clipCount: 234,
//     avgViews: 45000,
//     expiryStatus: "FRESH" as const,
//   },
//   {
//     id: "2",
//     keyword: "コンボ",
//     streamers: ["笹木咲", "叶"],
//     profitScore: 92,
//     trend: "up" as const,
//     clipCount: 187,
//     avgViews: 38000,
//     expiryStatus: "FRESH" as const,
//   },
//   {
//     id: "3",
//     keyword: "初見殺し",
//     streamers: ["にじさんじ", "ホロライブ"],
//     profitScore: 88,
//     trend: "stable" as const,
//     clipCount: 156,
//     avgViews: 32000,
//     expiryStatus: "FRESH" as const,
//   },
//   {
//     id: "4",
//     keyword: "神回",
//     streamers: ["葛葉", "月ノ美兎"],
//     profitScore: 91,
//     trend: "up" as const,
//     clipCount: 203,
//     avgViews: 41000,
//     expiryStatus: "FRESH" as const,
//   },
//   {
//     id: "5",
//     keyword: "建築バトル",
//     streamers: ["天開司", "イブラヒム"],
//     profitScore: 72,
//     trend: "down" as const,
//     clipCount: 142,
//     avgViews: 28000,
//     expiryStatus: "FADING" as const,
//     expiryWarning: "直近再生数 -35%",
//     daysSincePeak: 5,
//     recentGrowth: -0.35,
//   },
//   {
//     id: "6",
//     keyword: "エモい",
//     streamers: ["鈴原るる", "椎名唯華"],
//     profitScore: 45,
//     trend: "down" as const,
//     clipCount: 98,
//     avgViews: 22000,
//     expiryStatus: "EXPIRED" as const,
//     expiryWarning: "ピークは9日前に終了",
//     daysSincePeak: 9,
//     recentGrowth: -0.62,
//   },
//   {
//     id: "7",
//     keyword: "ガチギレ",
//     streamers: ["叶", "笹木咲"],
//     profitScore: 89,
//     trend: "up" as const,
//     clipCount: 176,
//     avgViews: 35000,
//     expiryStatus: "FRESH" as const,
//   },
//   {
//     id: "8",
//     keyword: "爆笑",
//     streamers: ["剣持刀也", "郡道美玲"],
//     profitScore: 86,
//     trend: "stable" as const,
//     clipCount: 165,
//     avgViews: 30000,
//     expiryStatus: "FRESH" as const,
//   },
// ]

// export default function BuzzwordsPage() {
//   const [sortBy, setSortBy] = useState<"profit" | "growth" | "stability">("profit")
//   const [dateRange, setDateRange] = useState("14d")

//   return (
//     <div className="flex-1 p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="space-y-2">
//           <h1 className="text-3xl font-bold text-foreground">バズワード分析</h1>
//           <p className="text-muted-foreground">今、誰の、どの言葉を切り抜けば伸びやすいか？</p>
//         </div>

//         {/* Filters */}
//         <div className="bg-card rounded-lg border border-border p-4">
//           <div className="flex flex-wrap gap-4 items-center">
//             <div className="flex items-center gap-2">
//               <Filter className="w-4 h-4 text-muted-foreground" />
//               <span className="text-sm font-medium text-foreground">フィルター</span>
//             </div>

//             <div className="flex-1 flex flex-wrap gap-3">
//               {/* Sort by */}
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as any)}
//                 className="px-3 py-2 bg-input text-foreground rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="profit">儲かりやすさ</option>
//                 <option value="growth">成長率</option>
//                 <option value="stability">安定性</option>
//               </select>

//               {/* Date range */}
//               <select
//                 value={dateRange}
//                 onChange={(e) => setDateRange(e.target.value)}
//                 className="px-3 py-2 bg-input text-foreground rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//               >
//                 <option value="7d">過去7日</option>
//                 <option value="14d">過去14日</option>
//                 <option value="30d">過去30日</option>
//                 <option value="90d">過去90日</option>
//               </select>

//               {/* Platform */}
//               <select className="px-3 py-2 bg-input text-foreground rounded border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
//                 <option value="all">すべてのプラットフォーム</option>
//                 <option value="youtube">YouTube</option>
//                 <option value="twitch">Twitch</option>
//               </select>

//               {/* Streamer selector */}
//               <button className="px-3 py-2 bg-muted text-foreground rounded text-sm hover:bg-muted/80 transition-colors">
//                 配信者を選択
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Info box */}
//         <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
//           <div className="flex gap-3">
//             <div className="text-primary">💡</div>
//             <div className="space-y-1">
//               <div className="text-sm font-medium text-foreground">おすすめの使い方</div>
//               <div className="text-sm text-muted-foreground">
//                 儲かりやすさスコアは、クリップ数、平均視聴数、エンゲージメント率、成長率を総合的に判断した指標です。
//                 キーワードをクリックすると、詳細な分析と具体的な配信情報が表示されます。
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Buzzword Table */}
//         <BuzzwordTable buzzwords={mockBuzzwords} />
//       </div>
//     </div>
//   )
// }
