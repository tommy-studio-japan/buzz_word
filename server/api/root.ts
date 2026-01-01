import { createTRPCRouter } from "../trpc";
import { streamsRouter } from "./routers/streams";
import { channelsRouter } from "./routers/channels";

export const appRouter = createTRPCRouter({
  /** [memp]
   * API名空間を定義
   * この中にlistなどのprocedureがある
   */
  streams: streamsRouter,
  channels: channelsRouter,
});

export type AppRouter = typeof appRouter;
