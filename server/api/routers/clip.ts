import { z } from "zod"
import { router, publicProcedure } from "../trpc"

// Mock clip storage
const clips: Array<{
  id: string
  streamId: string
  startTime: string
  endTime: string
  memo?: string
  tags: string[]
  userId?: string
}> = []

export const clipRouter = router({
  save: publicProcedure
    .input(
      z.object({
        streamId: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        memo: z.string().optional(),
        tags: z.array(z.string()).default([]),
        userId: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const newClip = {
        id: `clip-${Date.now()}`,
        ...input,
      }
      clips.push(newClip)
      return newClip
    }),

  getByStreamId: publicProcedure.input(z.object({ streamId: z.string() })).query(({ input }) => {
    return clips.filter((c) => c.streamId === input.streamId)
  }),

  getAll: publicProcedure.query(() => {
    return clips
  }),
})
