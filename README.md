## 🧱 アーキテクチャ概要（レイヤー構成）

本プロジェクトは、責務を明確に分離するため  
**レイヤードアーキテクチャ（層構造）** を採用しています。

各層は「何をするか」「どこに置くか」が明確に分かれており、  
実装・保守・拡張をしやすい構成になっています。

---

## 📚 レイヤーとファイル配置対応表

| レイヤー | 役割 | 主な責務 | 配置例 |
|---|---|---|---|
| **UI層** | ユーザー操作・表示 | 入力受付、API呼び出し、画面描画 | `app/`<br>`components/` |
| **API / Router層** | APIの入口・指揮 | 入力バリデーション、認可、処理フロー制御 | `server/api/routers/` |
| **Service層** | 処理の実体 | 外部API呼び出し、DB操作の組み合わせ、再利用可能な処理 | `server/services/`<br>例：`youtubeService.ts`、`utteranceBuilder.ts` |
| **Domain層** | 業務ルール | プロダクト固有の判断・計算（純粋ロジック） | `server/domain/`<br>例：`buzzScore.ts`、`dangerWord.ts` |
| **Infrastructure層** | 技術依存処理 | DB接続、外部API、SDKラッパー | `server/db/`、`server/lib/`<br>例：`supabase.ts`、`youtubeApi.ts` |
| **共通 / 型定義** | 共有定義 | 型定義、DTO、共通ユーティリティ | `server/types/`、`lib/` |

---

## 🔑 設計方針

- **UI層**  
  - ビジネスロジックは書かない  
  - APIを呼び、結果を表示するだけ  

- **Router層（tRPC）**  
  - 処理の「順番」を決めるだけ  
  - 実際の処理は Service 層に委譲する  

- **Service層**  
  - 実処理の中心  
  - router / UI から独立して再利用できる形にする  

- **Domain層**  
  - 技術に依存しない純粋な業務ルール  
  - テストしやすい関数として実装する  

- **Infrastructure層**  
  - Supabase / YouTube API など技術依存部分  
  - 他層から直接触らせず、Service経由で利用する  

---

## 🧠 補足

- 小〜中規模では **Service層とDomain層をまとめてもOK**  
- 規模が大きくなるほど **Domain層を分離** すると保守性が向上  
- Router層にロジックを書き始めたら、Service層への切り出しを検討する  

この構成により、  
**「作りやすく、壊れにくく、拡張しやすい」** コードベースを目指します。

---

## 🧠 Context（createContext）の設計方針

本プロジェクトでは、tRPC の `ctx` を  
**「Router と Service をつなぐ依存注入（DI）コンテナ」**として扱います。

Router は `ctx` に含まれる Service を使って処理を指揮し、  
**実装詳細（API / DB / アルゴリズム）を直接触りません。**

---

### createContext の責務

- DB クライアントを用意する
- 外部 API クライアントを用意する
- Service / Domain ロジックを組み立てて注入する
- Router が必要とする依存をすべて揃える

---

### createContext の例

```ts
// server/api/trpc/context.ts
import { youtubeService } from "@/server/services/youtubeService"
import { utteranceBuilder } from "@/server/services/utteranceBuilder"
import { clipGenerator } from "@/server/services/clipGenerator"
import { db } from "@/server/db"

export const createContext = async () => {
  return {
    db,
    youtube: youtubeService,
    utteranceBuilder,
    clipGenerator,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

🧩 Domain / Service の切り分けガイド

Service と Domain は似ていますが、役割が違います。

⸻

Service 層とは？
	•	技術と接してよい
	•	DB / API / I/O を扱ってよい
	•	処理の流れを持つ

例：
	•	YouTube 字幕取得
	•	utterances の生成
	•	clips の保存

👉 「どうやって実現するか」

⸻

Domain 層とは？
	•	技術に依存しない
	•	純粋な計算・判断
	•	副作用を持たない

例：
	•	バズスコア計算
	•	危険ワード判定
	•	クリップ候補の評価ロジック

👉 「何が正しいか」

判断基準 | Domain | Service
DBに触る |   ❌   |    ✅
外部API  |   ❌   |    ✅
純粋関数  |  ✅    |    ❌
ビジネスルール |  ✅ |   △
実装依存 |    ❌    |   ✅
