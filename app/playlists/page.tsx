// "use client"

// import { Header } from "@/components/header"
// import { Sidebar } from "@/components/sidebar"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { List, Play, Plus } from "lucide-react"
// import Link from "next/link"

// const mockPlaylists = [
//   {
//     id: "1",
//     name: "ゲーム配信まとめ",
//     description: "お気に入りのゲーム配信アーカイブ",
//     thumbnailUrl: "/street-fighter-gameplay.jpg",
//     videoCount: 42,
//     lastUpdated: "2日前",
//   },
//   {
//     id: "2",
//     name: "歌枠コレクション",
//     description: "素敵な歌声をまとめたプレイリスト",
//     thumbnailUrl: "/singing-karaoke-vtuber.jpg",
//     videoCount: 28,
//     lastUpdated: "1週間前",
//   },
//   {
//     id: "3",
//     name: "切り抜きベスト",
//     description: "面白いシーンの切り抜き集",
//     thumbnailUrl: "/anime-vtuber-talking.jpg",
//     videoCount: 156,
//     lastUpdated: "3日前",
//   },
//   {
//     id: "4",
//     name: "コラボ配信",
//     description: "メンバー同士のコラボ配信",
//     thumbnailUrl: "/minecraft-building.png",
//     videoCount: 67,
//     lastUpdated: "5日前",
//   },
// ]

// export default function PlaylistsPage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <div className="flex flex-1">
//         <Sidebar />
//         <main className="flex-1 overflow-y-auto">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <List className="w-6 h-6 text-primary" />
//                 <h1 className="text-2xl font-bold">プレイリスト</h1>
//               </div>
//               <Button>
//                 <Plus className="w-4 h-4 mr-2" />
//                 新規プレイリスト
//               </Button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {mockPlaylists.map((playlist) => (
//                 <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
//                   <Card className="bg-card overflow-hidden transition-transform hover:scale-105">
//                     <div className="relative aspect-video bg-muted group">
//                       <img
//                         src={playlist.thumbnailUrl || "/placeholder.svg"}
//                         alt={playlist.name}
//                         className="w-full h-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Play className="w-12 h-12 text-primary" />
//                       </div>
//                       <div className="absolute top-2 right-2 bg-background/90 px-2 py-1 rounded text-xs">
//                         {playlist.videoCount}本
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-semibold mb-1">{playlist.name}</h3>
//                       <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{playlist.description}</p>
//                       <p className="text-xs text-muted-foreground">{playlist.lastUpdated}更新</p>
//                     </div>
//                   </Card>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
