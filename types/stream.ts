export type StreamStatus = "live" | "scheduled" | "archive";

/**
 * 📌 DBの生カラムをそのままUIで使わず、
 * UIに必要な形に整形された型を定義しているのが重要
 */

/**
 * DB: public.streams の1行（生データ）
 */
export type StreamRow = {
  id: string; // uuid
  platform: string; // text (例: "youtube" | "twitch")
  video_id: string; // text: プラットフォームの動画ID（YouTubeなら watch?v= の値）
  title: string | null;

  channel_id: string; // uuid: public.channels.id への外部キー（@handle ではない）

  thumbnail_url: string | null;
  published_at: string | null; // timestamptz
  scheduled_time: string | null; // timestamptz

  // DBがtextでも、アプリの型は union に寄せると安全
  status: StreamStatus | null;

  duration_sec: number | null; // int8（秒）
  viewer_count_max: number | null; // int8
  viewer_count_average: number | null; // int8
  game_tag: string | null;

  created_at: string; // timestamptz
  updated_at: string | null; // timestamptz
  disabled_at: string | null; // timestamptz
};

/**
 * UI用：streams + channels + streamers を結合して扱う型
 */
export interface Stream {
  // streams
  id: string;
  platform: string;
  videoId: string;

  title: string | null;
  thumbnailUrl: string | null;

  publishedAt: string | null;
  scheduledTime: string | null;

  status: StreamStatus | null;

  durationSec: number | null;
  viewerCountMax: number | null;
  viewerCountAverage: number | null;

  gameTag: string | null;

  createdAt: string;
  updatedAt: string | null;
  disabledAt: string | null;

  // channels + streamers（JOINで取る）
  channelId: string;              // channels.id (uuid)
  channelName: string | null;     // channels.channel_name
  channelHandle: string | null;   // channels.handle_name (@xxxx)
  channelAvatar: string | null;   // channels.avatar_url

  streamerId: string | null;      // channels.streamer_id
  streamerName: string | null;    // streamers.streamer_name
  streamerAvatar: string | null;  // streamers.avatar_url
  group: string | null;           // streamers.group
}