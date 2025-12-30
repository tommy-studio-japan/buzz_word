"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Info, HelpCircle, FileText, Mail } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">案内</h1>
            </div>

            <div className="space-y-6">
              <Card className="bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Nijidexについて</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nijidexは、にじさんじライバーの配信を検索・視聴・切り抜き作成ができるプラットフォームです。
                  配信の字幕から検索し、タイムスタンプから直接該当シーンへジャンプできます。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  お気に入りのライバーの配信をフォローし、プレイリストで整理して、
                  マルチビューで複数の配信を同時に楽しむことができます。
                </p>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold">使い方</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>検索バーから配信内容やライバー名で検索できます</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>検索結果のタイムスタンプをクリックすると該当シーンへジャンプします</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>視聴ページで開始・終了時間を選択して切り抜きを作成できます</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>お気に入りのライバーを登録すると通知を受け取れます</span>
                    </li>
                  </ul>
                </Card>

                <Card className="bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold">主な機能</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>配信の全文字幕から検索</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>タイムスタンプから該当シーンへジャンプ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>切り抜き作成とメモ・タグ付け</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>プレイリスト管理</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>マルチビュー対応</span>
                    </li>
                  </ul>
                </Card>
              </div>

              <Card className="bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">お問い合わせ</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  ご質問やフィードバックがございましたら、お気軽にお問い合わせください。
                </p>
                <Link href="mailto:support@nijidex.com" className="text-primary hover:underline">
                  support@nijidex.com
                </Link>
              </Card>

              <Card className="bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">バージョン情報</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>バージョン: 1.0.0</p>
                  <p>最終更新: 2025年1月</p>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
