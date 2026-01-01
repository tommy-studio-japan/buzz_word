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
});
