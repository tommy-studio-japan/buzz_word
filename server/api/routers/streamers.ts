import { randomUUID } from "crypto";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { supabaseServer } from "@/lib/supabase/server";

export type Streamer = {
  id: string;
  streamerName: string;
  avatarUrl: string | null;
  group: string | null;
};

export const streamersRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(200).default(100),
        })
        .optional(),
    )
    .query(async ({ input }): Promise<Streamer[]> => {
      const { limit = 100 } = input ?? {};

      const { data, error } = await supabaseServer
        .from("streamers")
        .select("id, streamer_name, avatar_url, \"group\"")
        .order("streamer_name", { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return (
        data?.map((row) => ({
          id: row.id,
          streamerName: row.streamer_name,
          avatarUrl: row.avatar_url ?? null,
          group: row.group ?? null,
        })) ?? []
      );
    }),

  create: publicProcedure
    .input(
      z.object({
        streamerName: z.string().min(1),
        avatarUrl: z.string().url().optional().nullable(),
        group: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const now = new Date().toISOString();
      const row = {
        id: randomUUID(),
        streamer_name: input.streamerName,
        avatar_url: input.avatarUrl ?? null,
        group: input.group ?? null,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabaseServer
        .from("streamers")
        .insert(row)
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "failed to create streamer");
      }

      return { id: data.id as string };
    }),
});
