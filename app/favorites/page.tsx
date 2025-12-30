// "use client"

// import { useState } from "react"
// import { Header } from "@/components/header"
// import { Sidebar } from "@/components/sidebar"
// import { Tabs } from "@/components/tabs"
// import { StreamCard } from "@/components/stream-card"
// import { Heart } from "lucide-react"

// const mockFavorites = [
//   {
//     id: "1",
//     title: "【STREET FIGHTER 6】ランクマッチで上を目指す配信",
//     thumbnailUrl: "/street-fighter-gameplay.jpg",
//     channelName: "叶",
//     channelAvatar: "/anime-avatar.png",
//     group: "[NIJISANJI JP]",
//     status: "live" as const,
//     viewerCount: 12543,
//     gameTag: "Street_Fighter",
//     duration: "4:15:00",
//   },
//   {
//     id: "3",
//     title: "【Minecraft】新しい建築プロジェクト開始",
//     thumbnailUrl: "/minecraft-building.png",
//     channelName: "月ノ美兎",
//     channelAvatar: "/anime-avatar-girl-pink.jpg",
//     group: "[NIJISANJI JP]",
//     status: "live" as const,
//     viewerCount: 15678,
//     gameTag: "Minecraft",
//     duration: "1:45:30",
//   },
//   {
//     id: "5",
//     title: "【Apex Legends】ランク上げ配信",
//     thumbnailUrl: "/apex-legends-gameplay.jpg",
//     channelName: "渋谷ハル",
//     channelAvatar: "/anime-avatar-boy.png",
//     group: "[NIJISANJI JP]",
//     status: "live" as const,
//     viewerCount: 20123,
//     gameTag: "Apex_Legends",
//     duration: "5:10:00",
//   },
// ]

// const tabs = [
//   { id: "live", label: "配信中", count: 3 },
//   { id: "scheduled", label: "配信予定", count: 8 },
//   { id: "archive", label: "アーカイブ" },
//   { id: "clips", label: "切り抜き" },
// ]

// export default function FavoritesPage() {
//   const [activeTab, setActiveTab] = useState("live")

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <div className="flex flex-1">
//         <Sidebar />
//         <main className="flex-1 overflow-y-auto">
//           <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
//           <div className="p-6">
//             <div className="flex items-center gap-2 mb-6">
//               <Heart className="w-6 h-6 text-primary fill-primary" />
//               <h1 className="text-2xl font-bold">お気に入り</h1>
//             </div>
//             {mockFavorites.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                 {mockFavorites.map((stream) => (
//                   <StreamCard key={stream.id} {...stream} />
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12 text-center">
//                 <Heart className="w-16 h-16 text-muted-foreground mb-4" />
//                 <h2 className="text-xl font-semibold mb-2">お気に入りはありません</h2>
//                 <p className="text-muted-foreground">チャンネルをお気に入りに追加すると、ここに表示されます</p>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
