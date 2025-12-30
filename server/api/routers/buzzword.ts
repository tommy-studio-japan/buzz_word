import { router, publicProcedure } from "../trpc"
import { z } from "zod"

// Mock data generation helpers
const generateMockBuzzwords = () => {
  const keywords = [
    { word: "スーパープレイ", streamers: ["花芽すみれ", "渋谷ハル"], trend: "up" },
    { word: "コンボ", streamers: ["笹木咲", "叶"], trend: "up" },
    { word: "初見殺し", streamers: ["にじさんじ", "ホロライブ"], trend: "stable" },
    { word: "神回", streamers: ["葛葉", "月ノ美兎"], trend: "up" },
    { word: "建築バトル", streamers: ["天開司", "イブラヒム"], trend: "stable" },
    { word: "エモい", streamers: ["鈴原るる", "椎名唯華"], trend: "down" },
    { word: "ガチギレ", streamers: ["叶", "笹木咲"], trend: "up" },
    { word: "爆笑", streamers: ["剣持刀也", "郡道美玲"], trend: "stable" },
    { word: "ラスボス", streamers: ["社築", "叶"], trend: "up" },
    { word: "伝説の", streamers: ["にじさんじ", "ホロライブ"], trend: "up" },
  ]

  return keywords.map((kw, idx) => ({
    id: `buzzword-${idx + 1}`,
    keyword: kw.word,
    streamers: kw.streamers,
    profitScore: Math.floor(75 + Math.random() * 25),
    trend: kw.trend as "up" | "stable" | "down",
    clipCount: Math.floor(50 + Math.random() * 200),
    avgViews: Math.floor(5000 + Math.random() * 45000),
    engagementRate: Number.parseFloat((0.05 + Math.random() * 0.15).toFixed(2)),
    recentGrowth: Number.parseFloat((0.1 + Math.random() * 0.4).toFixed(2)),
  }))
}

const generateHeatmapData = (keyword: string) => {
  const streamers = ["花芽すみれ", "渋谷ハル", "笹木咲", "叶", "葛葉", "月ノ美兎"]
  const days = 14
  const data = []

  for (let day = 0; day < days; day++) {
    const date = new Date()
    date.setDate(date.getDate() - day)

    for (const streamer of streamers) {
      const frequency = Math.floor(Math.random() * 15)
      if (frequency > 2) {
        data.push({
          date: date.toISOString(),
          streamer,
          frequency,
          avgViews: Math.floor(5000 + Math.random() * 20000),
          engagement: Number.parseFloat((0.05 + Math.random() * 0.1).toFixed(2)),
          intensity: frequency / 15,
        })
      }
    }
  }

  return data
}

export const buzzwordRouter = router({
  getTop: publicProcedure
    .input(
      z.object({
        sortBy: z.enum(["profit", "growth", "stability"]).optional().default("profit"),
        streamers: z.array(z.string()).optional(),
        dateRange: z.enum(["7d", "14d", "30d", "90d"]).optional().default("14d"),
        platform: z.enum(["all", "youtube", "twitch"]).optional().default("all"),
      }),
    )
    .query(({ input }) => {
      const buzzwords = generateMockBuzzwords()

      // Sort based on input
      let sorted = [...buzzwords]
      if (input.sortBy === "growth") {
        sorted.sort((a, b) => b.recentGrowth - a.recentGrowth)
      } else if (input.sortBy === "stability") {
        sorted.sort((a, b) => (b.trend === "stable" ? 1 : -1))
      } else {
        sorted.sort((a, b) => b.profitScore - a.profitScore)
      }

      // Filter by streamers if provided
      if (input.streamers && input.streamers.length > 0) {
        sorted = sorted.filter((bw) => bw.streamers.some((s) => input.streamers?.includes(s)))
      }

      return sorted
    }),

  getHeatmapData: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
        dateRange: z.enum(["7d", "14d", "30d"]).optional().default("14d"),
      }),
    )
    .query(({ input }) => {
      return generateHeatmapData(input.keyword)
    }),

  getByKeyword: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
      }),
    )
    .query(({ input }) => {
      const buzzwords = generateMockBuzzwords()
      const found = buzzwords.find((bw) => bw.keyword === input.keyword)

      if (!found) {
        throw new Error("Keyword not found")
      }

      return {
        ...found,
        description: `「${input.keyword}」は現在、複数の配信者で頻繁に使用されており、視聴者のエンゲージメントが高い傾向にあります。`,
        whyProfitable: [
          "高いクリップ生成率（平均200件/週）",
          "視聴者のリアクションが良好（エンゲージメント率12%）",
          "複数の配信者で使用されており、トレンド性が高い",
          "直近2週間で成長率+25%を記録",
        ],
        topClips: [
          {
            id: "1",
            title: `【${input.keyword}】神プレイ集！`,
            streamer: found.streamers[0],
            views: 45000,
            thumbnail: "/street-fighter-gameplay.jpg",
            timestamp: "2:34:15",
          },
          {
            id: "2",
            title: `${input.keyword}で大爆笑www`,
            streamer: found.streamers[1] || found.streamers[0],
            views: 32000,
            thumbnail: "/apex-legends-gameplay.jpg",
            timestamp: "1:15:30",
          },
          {
            id: "3",
            title: `伝説の${input.keyword}シーン`,
            streamer: found.streamers[0],
            views: 28000,
            thumbnail: "/minecraft-building.png",
            timestamp: "3:22:45",
          },
        ],
      }
    }),

  getRelatedStreams: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
      }),
    )
    .query(({ input }) => {
      return [
        {
          id: "1",
          title: `【APEX】ランクマ配信 ${input.keyword}目指す`,
          streamer: "花芽すみれ",
          date: new Date().toISOString(),
          duration: "4:23:15",
          keywordCount: 15,
        },
        {
          id: "2",
          title: `マイクラ建築！${input.keyword}チャレンジ`,
          streamer: "笹木咲",
          date: new Date().toISOString(),
          duration: "3:45:20",
          keywordCount: 12,
        },
      ]
    }),

  getWithLifecycle: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
      }),
    )
    .query(({ input }) => {
      const buzzwords = generateMockBuzzwords()
      const found = buzzwords.find((bw) => bw.keyword === input.keyword)

      if (!found) {
        throw new Error("Keyword not found")
      }

      // Calculate expiry status
      const expiredKeywords = ["エモい", "やばい"]
      const fadingKeywords = ["建築バトル", "神回"]

      let status = "FRESH"
      const peakDate = new Date()
      peakDate.setDate(peakDate.getDate() - 1)
      let daysSincePeak = 1
      let recentGrowth = 0.25
      let clipSuccessRate = 0.35

      if (expiredKeywords.includes(input.keyword)) {
        status = "EXPIRED"
        peakDate.setDate(peakDate.getDate() - 9)
        daysSincePeak = 9
        recentGrowth = -0.62
        clipSuccessRate = 0.08
      } else if (fadingKeywords.includes(input.keyword)) {
        status = "FADING"
        peakDate.setDate(peakDate.getDate() - 5)
        daysSincePeak = 5
        recentGrowth = -0.35
        clipSuccessRate = 0.12
      }

      return {
        ...found,
        lifecycle: {
          status,
          peakDate: peakDate.toISOString(),
          daysSincePeak,
          recentGrowth,
          clipSuccessRate,
          decayRate: status === "EXPIRED" ? 0.75 : status === "FADING" ? 0.45 : 0.0,
        },
      }
    }),

  getExpiryStatus: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
        streamerId: z.string().optional(),
      }),
    )
    .query(({ input }) => {
      // Mock expiry status calculation
      const expiredKeywords = ["エモい", "やばい"]
      const fadingKeywords = ["建築バトル", "神回"]

      if (expiredKeywords.includes(input.keyword)) {
        return {
          status: "EXPIRED",
          peakDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          daysSincePeak: 9,
          recentGrowth: -0.62,
          clipSuccessRate: 0.08,
          warning: "ピークは9日前に終了",
        }
      } else if (fadingKeywords.includes(input.keyword)) {
        return {
          status: "FADING",
          peakDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          daysSincePeak: 5,
          recentGrowth: -0.35,
          clipSuccessRate: 0.12,
          warning: "直近再生数 -35%",
        }
      }

      return {
        status: "FRESH",
        peakDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        daysSincePeak: 1,
        recentGrowth: 0.25,
        clipSuccessRate: 0.35,
        warning: null,
      }
    }),

  getExpired: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
      }),
    )
    .query(({ input }) => {
      return [
        {
          keyword: "エモい",
          peakDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          daysSincePeak: 9,
          recentGrowth: -0.62,
          clipSuccessRate: 0.08,
        },
        {
          keyword: "やばい",
          peakDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          daysSincePeak: 12,
          recentGrowth: -0.58,
          clipSuccessRate: 0.06,
        },
      ].slice(0, input.limit)
    }),

  getAlternatives: publicProcedure
    .input(
      z.object({
        keyword: z.string(),
      }),
    )
    .query(({ input }) => {
      return {
        relatedKeywords: ["スーパープレイ", "ガチギレ", "神プレイ"],
        differentAngles: ["裏話", "初見リアクション", "NG集"],
        freshKeywords: ["コンボ", "ラスボス", "伝説の"],
      }
    }),
})
