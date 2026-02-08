import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { supabaseServer } from "@/lib/supabase/server";
import { Stream, StreamStatus } from "@/types/stream";
import { firstOrSelf } from "../../lib/supabase/utils"
/**
 * Supabase依存はこのファイルだけ
 * UI には Stream[] だけを返す
 */

/**
 * =============================================================
 * 解析ジョブ（MVP: Supabase-backed）
 * - analysis_jobs テーブルに保存し、UIは jobId をポーリングして進捗表示
 * - 本番では BullMQ/Redis などのワーカーに置き換える
 * =============================================================
 */

type AnalysisJobStatus =
  | "QUEUED"
  | "EXTRACTING_AUDIO"
  | "TRANSCRIBING"
  | "EXTRACTING_TOPICS"
  | "INDEXING"
  | "DONE"
  | "FAILED";

type AnalysisJobRow = {
  id: string;
  url: string;
  stream_id: string | null;
  status: AnalysisJobStatus | string;
  progress: number;
  message: string | null;
  retry_count: number | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const parseYoutubeVideoId = (url: string): string | null => {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      return u.searchParams.get("v");
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\/+/, "");
      return id || null;
    }
    return null;
  } catch {
    return null;
  }
};

const findStreamIdByUrl = async (url: string): Promise<string | null> => {
  const videoId = parseYoutubeVideoId(url);
  if (!videoId) return null;

  const { data, error } = await supabaseServer
    .from("streams")
    .select("id")
    .eq("platform", "youtube")
    .eq("video_id", videoId)
    .is("disabled_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.id ?? null;
};

const updateJobDb = async (
  jobId: string,
  patch: Partial<Pick<AnalysisJobRow, "status" | "progress" | "message" | "started_at" | "finished_at">>,
) => {
  const { error } = await supabaseServer
    .from("analysis_jobs")
    .update({
      ...patch,
      // updated_at は DB 側で自動更新していない場合があるので、ここで更新しておく
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (error) throw new Error(error.message);
};

const simulateAnalysis = async (jobId: string) => {
  try {
    await updateJobDb(jobId, {
      status: "RUNNING", // スキーマが RUNNING を許容していない場合に備えて段階ステータスを即入れる
      progress: 1,
      message: "開始しました",
      started_at: new Date().toISOString(),
    } as any);

    await updateJobDb(jobId, { status: "EXTRACTING_AUDIO", progress: 10, message: "音声を抽出しています" });
    await sleep(800);

    await updateJobDb(jobId, { status: "TRANSCRIBING", progress: 35, message: "ASRで文字起こし中" });
    await sleep(1200);

    await updateJobDb(jobId, { status: "EXTRACTING_TOPICS", progress: 65, message: "話題ワードを抽出しています" });
    await sleep(900);

    await updateJobDb(jobId, { status: "INDEXING", progress: 85, message: "秒単位インデックスを作成しています" });
    await sleep(700);

    await updateJobDb(jobId, {
      status: "DONE",
      progress: 100,
      message: "完了しました",
      finished_at: new Date().toISOString(),
    });
  } catch (e) {
    try {
      await updateJobDb(jobId, {
        status: "FAILED",
        progress: 100,
        message: e instanceof Error ? e.message : "失敗しました",
        finished_at: new Date().toISOString(),
      });
    } catch {
      // ignore
    }
  }
};

/** [memo] 
 * tRPCにおけるProcedure (クライアントから呼び出せるAPIの単位 e.g. GET /streams)
 *
[tRPCでのAPIは以下の３階層で構成される] 
 router
  └─ procedure
        ├─ input
        ├─ output
        └─ resolver
 
 * list: procedure名
  名前：意味
　streamsRouter　：　APIのまとまり（namespace、APIの名前空間）
　list　：　procedure名
　publicProcedure　：　procedureの土台
　.query()　：　GET的処理
　.mutation()　：　POST/PUT/DELETE的処理
      
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
          const channel = firstOrSelf<any>(row.channels);
          const streamer = firstOrSelf<any>(channel?.streamers);

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
            group: (streamer?.group ?? streamer?.["group"]) ?? null,
          };
        }) ?? []
      );
    }),

  createAnalysisJob: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      const streamId = await findStreamIdByUrl(input.url);

      if (!streamId) {
        throw new Error("このURLの配信が未登録です。先にYouTube取り込み（ingest）を実行してください。");
      }

      const { data, error } = await supabaseServer
        .from("analysis_jobs")
        .insert({
          url: input.url,
          stream_id: streamId,
          status: "QUEUED",
          progress: 0,
          message: "待機中",
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const jobId = data.id as string;

      // 非同期で解析開始（MVP: 疑似処理）
      void simulateAnalysis(jobId);

      return { jobId };
    }),

  getAnalysisJob: publicProcedure
    .input(z.object({ jobId: z.string().min(1) }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseServer
        .from("analysis_jobs")
        .select("status, progress, message")
        .eq("id", input.jobId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return { status: "FAILED" as const, progress: 100, message: "ジョブが見つかりません" };
      }

      return {
        status: data.status as AnalysisJobStatus,
        progress: data.progress as number,
        message: (data.message ?? null) as string | null,
      };
    }),

  // byId: publicProcedure
  // .input
});
