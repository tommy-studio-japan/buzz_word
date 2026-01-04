import { createTRPCRouter } from "../trpc";
import { streamsRouter } from "./routers/streams";
import { channelsRouter } from "./routers/channels";
import { youtubeRouter } from "./routers/youtube";

export const appRouter = createTRPCRouter({
  /** [memp]
   * API名空間を定義
   * この中にlistなどのprocedureがある
   */
  streams: streamsRouter,
  channels: channelsRouter,
  youtube: youtubeRouter,
});

export type AppRouter = typeof appRouter;
