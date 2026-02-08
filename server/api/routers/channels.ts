import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { supabaseServer } from "@/lib/supabase/server";

export type Channel = {
  id: string;
  platform: string;
  platformChannelId: string;
  channelName: string | null;
  handleName: string | null;
  avatarUrl: string | null;
  streamerId: string | null;
  streamerName: string | null;
  streamerAvatar: string | null;
  group: string | null;
};

/**
 * Supabase依存はこのファイルだけ
 * UI には Channel[] だけを返す
 */
export const channelsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(50),
        })
        .optional(),
    )
    .query(async ({ input }): Promise<Channel[]> => {
      const { limit = 50 } = input ?? {};

      const { data, error } = await supabaseServer
        .from("channels")
        .select(
          `
          id,
          platform,
          platform_channel_id,
          channel_name,
          handle_name,
          avatar_url,
          streamer_id,
          streamers (
            streamer_name,
            avatar_url,
            "group"
          )
        `,
        )
        .order("channel_name", { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return (
        data?.map((row): Channel => {
          const streamer = row.streamers?.[0] ?? null;

          return {
            id: row.id,
            platform: row.platform,
            platformChannelId: row.platform_channel_id,
            channelName: row.channel_name ?? null,
            handleName: row.handle_name ?? null,
            avatarUrl: row.avatar_url ?? null,
            streamerId: row.streamer_id ?? null,
            streamerName: streamer?.streamer_name ?? null,
            streamerAvatar: streamer?.avatar_url ?? null,
            group: streamer?.group ?? null,
          };
        }) ?? []
      );
    }),

  create: publicProcedure
    .input(
      z.object({
        platform: z.string().min(1),
        platformChannelId: z.string().min(1),
        channelName: z.string().min(1),
        handleName: z.string().optional().nullable(),
        avatarUrl: z.string().url().optional().nullable(),
        streamerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const row = {
        platform: input.platform,
        platform_channel_id: input.platformChannelId,
        channel_name: input.channelName,
        handle_name: input.handleName ?? null,
        avatar_url: input.avatarUrl ?? null,
        streamer_id: input.streamerId,
      };

      const { data, error } = await supabaseServer
        .from("channels")
        .upsert(row, { onConflict: "platform,platform_channel_id" })
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "failed to upsert channel");
      }

      return { id: data.id as string };
    }),
});
