// "use client"

// import { Suspense } from "react"
// import { useSearchParams } from "next/navigation"
// import { Header } from "@/components/header"
// import { Sidebar } from "@/components/sidebar"
// import { SearchResult } from "@/components/search-result"
// import { Button } from "@/components/ui/button"
// import { SlidersHorizontal } from "lucide-react"

// function SearchContent() {
//   const searchParams = useSearchParams()
//   const query = searchParams.get("q") || ""

//   // Mock search results with transcript matches
//   const mockResults = [
//     {
//       id: "1",
//       streamTitle: "【STREET FIGHTER 6】ランクマッチで上を目指す配信",
//       channelName: "叶",
//       channelAvatar: "/anime-avatar.png",
//       thumbnailUrl: "/street-fighter-gameplay.jpg",
//       timestamp: "4:15:23",
//       transcriptText:
//         "このコンボは本当に強いですね。相手のガードを崩すための重要なテクニックです。タイミングが大事なので練習が必要ですが、マスターすれば試合を有利に進められます。",
//       matchedText: "コンボ",
//     },
//     {
//       id: "2",
//       streamTitle: "【雑談】最近のこと話す！",
//       channelName: "Elira Pendora",
//       channelAvatar: "/anime-avatar-girl.jpg",
//       thumbnailUrl: "/anime-vtuber-talking.jpg",
//       timestamp: "2:30:15",
//       transcriptText:
//         "最近、新しいゲームを始めたんですけど、すごく面白いです！みんなも一緒にプレイしませんか？コラボ配信とかもやりたいなって思ってます。",
//       matchedText: "ゲーム",
//     },
//     {
//       id: "3",
//       streamTitle: "【Minecraft】新しい建築プロジェクト開始",
//       channelName: "月ノ美兎",
//       channelAvatar: "/anime-avatar-girl-pink.jpg",
//       thumbnailUrl: "/minecraft-building.png",
//       timestamp: "1:45:30",
//       transcriptText:
//         "この建物のデザインは中世ヨーロッパの城をイメージしています。石のブロックを使って、本格的な雰囲気を出していきたいと思います。",
//       matchedText: "建築",
//     },
//     {
//       id: "1",
//       streamTitle: "【STREET FIGHTER 6】ランクマッチで上を目指す配信",
//       channelName: "叶",
//       channelAvatar: "/anime-avatar.png",
//       thumbnailUrl: "/street-fighter-gameplay.jpg",
//       timestamp: "5:22:10",
//       transcriptText:
//         "フレーム有利の状況を作ることが重要です。相手の行動を読んで、適切な技を出すことで、確実にダメージを取れます。",
//       matchedText: "フレーム",
//     },
//     {
//       id: "4",
//       streamTitle: "【歌枠】深夜の歌配信",
//       channelName: "Petra Gurin",
//       channelAvatar: "/anime-avatar-girl-blue.jpg",
//       thumbnailUrl: "/singing-karaoke-vtuber.jpg",
//       timestamp: "3:20:00",
//       transcriptText: "この曲は本当に好きなんです。歌詞がとても心に響きます。みんなも一緒に歌ってくれると嬉しいです！",
//       matchedText: "歌詞",
//     },
//   ]

//   return (
//     <>
//       <Header />
//       <div className="flex flex-1">
//         <Sidebar />
//         <main className="flex-1 overflow-y-auto">
//           <div className="p-6 space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-xl font-bold">検索結果</h1>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   「{query}」の検索結果: {mockResults.length}件
//                 </p>
//               </div>
//               <Button variant="outline" size="sm">
//                 <SlidersHorizontal className="w-4 h-4 mr-2" />
//                 フィルター
//               </Button>
//             </div>

//             {/* Results */}
//             <div className="space-y-4">
//               {mockResults.map((result, index) => (
//                 <SearchResult key={`${result.id}-${index}`} {...result} />
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   )
// }

// export default function SearchPage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Suspense fallback={<div>Loading...</div>}>
//         <SearchContent />
//       </Suspense>
//     </div>
//   )
// }
