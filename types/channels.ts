/**
 * DB: public.channels の1行（生データ）
 * ※ Supabase の実カラム名に完全一致させる
 */
export type ChannelRow = {
  id: string; // uuid
  streamer_id: string; // uuid
  platform: string; // text
  platform_channel_id: string; // text

  handle_name: string | null; // text (nullable)
  channel_name: string; // text (NOT NULL) ※DBのカラム名が channle_name なのでそのまま
  avatar_url: string | null; // text (nullable)

  created_at: string; // timestamptz
  updated_at: string | null; // timestamptz (nullable)
  disabled_at: string | null; // timestamptz (nullable)
};