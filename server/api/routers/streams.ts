import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { supabaseServer } from "@/lib/supabase/server";
import { Stream, StreamStatus } from "@/types/stream";

/**
 * Supabase依存はこのファイルだけ
 * UI には Stream[] だけを返す
 */
export const streamsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
        })
        .optional(),
    )
    .query(async ({ input }): Promise<Stream[]> => {
      const { limit = 20 } = input ?? {};

      const { data, error } = await supabaseServer
        .from("streams")
        .select(`
          id,
          platform,
          video_id,
          title,
          thumbnail_url,
          published_at,
          scheduled_time,
          status,
          duration_sec,
          viewer_count_max,
          viewer_count_average,
          game_tag,
          created_at,
          updated_at,
          disabled_at,
          channel_id,
          channels (
            id,
            channel_name,
            handle_name,
            avatar_url,
            streamer_id,
            streamers (
              streamer_name,
              avatar_url,
              "group"
            )
          )
        `)
        .is("disabled_at", null)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return (
        data?.map((row): Stream => {
          const channel = row.channels?.[0] ?? null;
          const streamer = channel?.streamers?.[0] ?? null;

          return {
            // ===== streams =====
            id: row.id,
            platform: row.platform,
            videoId: row.video_id,

            title: row.title,
            thumbnailUrl: row.thumbnail_url,

            publishedAt: row.published_at,
            scheduledTime: row.scheduled_time,

            status: row.status as StreamStatus | null,

            durationSec: row.duration_sec,
            viewerCountMax: row.viewer_count_max,
            viewerCountAverage: row.viewer_count_average,

            gameTag: row.game_tag,

            createdAt: row.created_at,
            updatedAt: row.updated_at,
            disabledAt: row.disabled_at,

            // ===== channels =====
            channelId: row.channel_id,
            channelName: channel?.channel_name ?? null,
            channelHandle: channel?.handle_name ?? null,
            channelAvatar: channel?.avatar_url ?? null,

            // ===== streamers =====
            streamerId: channel?.streamer_id ?? null,
            streamerName: streamer?.streamer_name ?? null,
            streamerAvatar: streamer?.avatar_url ?? null,
            group: streamer?.group ?? null,
          };
        }) ?? []
      );
    }),
    byId: publicProcedure
    .input
});