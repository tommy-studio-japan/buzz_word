import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/api/root"

/**
 * 
 * @param req 
 * endpoint: "/api/trpc"
	•	入口はここだけ、という宣言 = "route.ts = HTTP専用アダプタ"
	•	router: appRouter
	•	「呼ばれた処理名（例: streams.list）を見て、appRouter の中から該当 procedure を探して実行する」
	•	export { handler as GET, handler as POST }
	•	GET/POST どっちで来ても受けられるようにしてる
	•	tRPC は内部的に「procedure名」などの情報を使って処理を判別します（RESTみたいにURLで分けない）
 * @returns 
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
