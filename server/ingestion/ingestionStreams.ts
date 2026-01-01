import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

/**
 * =========================
 * Supabase Admin Client
 * =========================
 * ※ Service Role Key を使用
 * ※ Route Handler / Server 側のみで利用すること
 */
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

/**
 * =========================
 * Input Types
 * =========================
 */

export type IngestChannelInput = {
  platform: string; // "youtube" | "twitch" ...
  platform_channel_id: string; // 不変ID（YouTube channelId 等）
  channel_name: string;
  handle_name?: string | null;
  avatar_url?: string | null;
  streamer_id: string; // NOT NULL (required)
};

export type IngestStreamInput = {
  platform: string; // "youtube"
  video_id: string; // YouTube videoId
  title?: string | null;
  thumbnail_url?: string | null;

  published_at?: string | null;   // ISO
  scheduled_time?: string | null; // ISO
  status?: "live" | "scheduled" | "archive" | null;

  duration_sec?: number | null;
  viewer_count_max?: number | null;
  viewer_count_average?: number | null;
  game_tag?: string | null;

  /**
   * 紐付け用（どのチャンネルの配信か）
   */
  channel_platform: string;
  channel_platform_channel_id: string;
};

/**
 * =========================
 * Main Ingestion Function
 * =========================
 */

export async function ingestStreams(params: {
  channels: IngestChannelInput[];
  streams: IngestStreamInput[];
}): Promise<{
  channelsUpserted: number;
  streamsUpserted: number;
}> {
  const { channels, streams } = params;

  /**
   * -------------------------
   * 0) streamers upsert (REQUIRED)
   * -------------------------
   */
  // Ensure valid UUIDs (Postgres uuid type)
  const streamerIds = Array.from(
    new Set(channels.map((c) => c.streamer_id)),
  );

  if (streamerIds.length > 0) {
    const { error } = await supabase.from("streamers").upsert(
      streamerIds.map((id) => ({
        id,
        streamer_name: "Test Streamer",
        avatar_url: null,
        group: "test",
        created_at: new Date().toISOString(),
        updated_at: null
      })),
    );

    if (error) {
      throw new Error(`streamers upsert failed: ${error.message}`);
    }
  }

  /**
   * -------------------------
   * 1) channels upsert
   * -------------------------
   * unique (platform, platform_channel_id)
   */
  if (channels.length > 0) {
    const { error } = await supabase
      .from("channels")
      .upsert(channels, {
        onConflict: "platform,platform_channel_id",
      });

    if (error) {
      throw new Error(`channels upsert failed: ${error.message}`);
    }
  }

  /**
   * -------------------------
   * 2) channel_id 解決
   * -------------------------
   * streams 側で参照される channels を取得
   */
  const channelKeySet = new Set(
    streams.map(
      (s) => `${s.channel_platform}:::${s.channel_platform_channel_id}`,
    ),
  );

  const channelKeys = Array.from(channelKeySet).map((key) => {
    const [platform, platform_channel_id] = key.split(":::");
    return { platform, platform_channel_id };
  });

  /**
   * MVP前提：
   * - 同一platformのみ（youtubeだけ等）を想定
   * - 複数platform同時対応は後で拡張
   */
  const platform = channelKeys[0]?.platform;
  const platformChannelIds = channelKeys
    .filter((k) => k.platform === platform)
    .map((k) => k.platform_channel_id);

  const { data: channelRows, error: fetchErr } = await supabase
    .from("channels")
    .select("id, platform, platform_channel_id")
    .eq("platform", platform)
    .in("platform_channel_id", platformChannelIds);

  if (fetchErr) {
    throw new Error(`channels fetch failed: ${fetchErr.message}`);
  }

  const channelIdMap = new Map<string, string>();
  for (const row of channelRows ?? []) {
    channelIdMap.set(
      `${row.platform}:::${row.platform_channel_id}`,
      row.id,
    );
  }

  /**
   * -------------------------
   * 3) streams upsert
   * -------------------------
   * unique (platform, video_id)
   */
  const streamRows = streams.map((s) => {
    const key = `${s.channel_platform}:::${s.channel_platform_channel_id}`;
    const channel_id = channelIdMap.get(key);

    if (!channel_id) {
      throw new Error(`channel not found for ${key}`);
    }

    return {
      platform: s.platform,
      video_id: s.video_id,
      channel_id,

      title: s.title ?? null,
      thumbnail_url: s.thumbnail_url ?? null,

      published_at: s.published_at ?? null,
      scheduled_time: s.scheduled_time ?? null,
      status: s.status ?? null,

      duration_sec: s.duration_sec ?? null,
      viewer_count_max: s.viewer_count_max ?? null,
      viewer_count_average: s.viewer_count_average ?? null,
      game_tag: s.game_tag ?? null,
    };
  });

  if (streamRows.length > 0) {
    const { error } = await supabase
      .from("streams")
      .upsert(streamRows, {
        onConflict: "platform,video_id",
      });

    if (error) {
      throw new Error(`streams upsert failed: ${error.message}`);
    }
  }

  return {
    channelsUpserted: channels.length,
    streamsUpserted: streamRows.length,
  };
}

/**
 * =========================
 * Local Test Runner (MVP)
 * =========================
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   ts-node server/ingestion/ingestionStreams.ts
 * or
 *   node --loader ts-node/esm server/ingestion/ingestionStreams.ts
 */

if (require.main === module) {
  (async () => {
    try {
      const testStreamerId = randomUUID();

      const result = await ingestStreams({
        channels: [
          {
            platform: "youtube",
            platform_channel_id: "UC_TEST_CHANNEL_001",
            channel_name: "Test Channel",
            handle_name: "@test_channel",
            avatar_url: null,
            streamer_id: testStreamerId,
          },
        ],
        streams: [
          {
            platform: "youtube",
            video_id: "TEST_VIDEO_001",
            title: "Test Stream Title",
            thumbnail_url: "https://placehold.co/640x360/png",
            published_at: new Date().toISOString(),
            scheduled_time: null,
            status: "archive",
            duration_sec: 3600,
            viewer_count_max: 1234,
            viewer_count_average: 456,
            game_tag: "test",
            channel_platform: "youtube",
            channel_platform_channel_id: "UC_TEST_CHANNEL_001",
          },
        ],
      });

      console.log("Ingestion succeeded:", result);
      process.exit(0);
    } catch (err) {
      console.error("Ingestion failed:", err);
      process.exit(1);
    }
  })();
}