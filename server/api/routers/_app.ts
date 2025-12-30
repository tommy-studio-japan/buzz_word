import { router } from "../trpc"
import { streamRouter } from "./stream"
import { clipRouter } from "./clip"
import { buzzwordRouter } from "./buzzword"

export const appRouter = router({
  stream: streamRouter,
  clip: clipRouter,
  buzzword: buzzwordRouter,
})

export type AppRouter = typeof appRouter
