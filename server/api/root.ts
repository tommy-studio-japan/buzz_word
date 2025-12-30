import { createTRPCRouter } from "../trpc";
import { streamsRouter } from "./routers/streams";

export const appRouter = createTRPCRouter({
  streams: streamsRouter,
});

export type AppRouter = typeof appRouter;