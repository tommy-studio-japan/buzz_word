import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { supabaseServer } from "@/lib/supabase/server";

type YoutubeTranscript = {
  language: string;
  source: "youtube_auto" | "youtube_manual";
  rawText: string;
};

type YoutubeMetadata = {
  videoId: string;
  title: string | null;
  publishedAt: string | null;
  durationSec: number | null;
  status: "live" | "scheduled" | "archive" | null;
  channelId: string;
};

type UtteranceInput = {
  startSec: number;
  endSec: number;
  text: string;
};

type ClipInput = {
  startSec: number;
  endSec: number;
  keywords: string[];
  note: string | null;
};

type YoutubeServices = {
  youtube: {
    parseUrl: (url: string) => { videoId: string };
    fetchMetadata: (videoId: string) => Promise<YoutubeMetadata>;
    fetchTranscript: (videoId: string) => Promise<YoutubeTranscript>;
  };
  utteranceBuilder: {
    buildFromTranscript: (rawText: string) => UtteranceInput[];
    normalize: (text: string) => Promise<string>;
  };
  clipGenerator: {
    generate: (utterances: Array<UtteranceInput & { normalizedText?: string | null }>) => ClipInput[];
  };
};
/** [memo]
 * この関数ではctxから型を抽出する。
 * 
 * @param ctx 
 * @returns 
 */
const requireServices = (ctx: unknown): YoutubeServices => {
  const services = ctx as Partial<YoutubeServices>;
  /** [memo] 一旦全ての型をオプショナルにして下のifで必須の型をYoutubeServicesに再定義 */
  if (!services.youtube || !services.utteranceBuilder || !services.clipGenerator) {
    throw new Error("Missing youtube/utteranceBuilder/clipGenerator services in tRPC context.");
  }
  return services as YoutubeServices;
};

const streamIdSchema = z.string().uuid();
const ingestOutputSchema = z.object({ streamId: streamIdSchema });
const transcriptOutputSchema = z.object({ transcriptId: z.string() });
const buildOutputSchema = z.object({ utterancesCreated: z.number().int() });
const normalizeOutputSchema = z.object({ normalized: z.number().int() });
const clipsOutputSchema = z.object({ clipsCreated: z.number().int() });
const ingestStatusSchema = z.object({
  utterancesTotal: z.number().int(),
  utterancesNormalized: z.number().int(),
  clipsCount: z.number().int(),
  status: z.enum(["queued", "processing", "done"]),
});
const listClipsOutputSchema = z.object({
  clips: z.array(
    z.object({
      startSec: z.number().int(),
      endSec: z.number().int(),
      keywords: z.array(z.string()),
      note: z.string().nullable(),
    }),
  ),
});

/**
 * YouTube ingest pipeline router
 * - Router only orchestrates; heavy logic lives in ctx services.
 */
export const youtubeRouter = createTRPCRouter({
  ingestUrl: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .output(ingestOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { youtube } = requireServices(ctx);

      const { videoId } = youtube.parseUrl(input.url);
      const metadata = await youtube.fetchMetadata(videoId);

      const { data, error } = await supabaseServer
        .from("streams")
        .upsert(
          {
            platform: "youtube",
            video_id: metadata.videoId,
            channel_id: metadata.channelId,
            title: metadata.title,
            published_at: metadata.publishedAt,
            duration_sec: metadata.durationSec,
            status: metadata.status,
          },
          { onConflict: "platform,video_id" },
        )
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "failed to upsert stream");
      }

      return { streamId: data.id };
    }),

  fetchTranscript: publicProcedure
    .input(z.object({ streamId: streamIdSchema }))
    .output(transcriptOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { youtube } = requireServices(ctx);

      const { data: stream, error: streamErr } = await supabaseServer
        .from("streams")
        .select("id, video_id")
        .eq("id", input.streamId)
        .is("disabled_at", null)
        .single();

      if (streamErr || !stream) {
        throw new Error(streamErr?.message ?? "stream not found");
      }

      const transcript = await youtube.fetchTranscript(stream.video_id);

      const { data, error } = await supabaseServer
        .from("transcripts")
        .upsert(
          {
            stream_id: stream.id,
            language: transcript.language,
            source: transcript.source,
            raw_text: transcript.rawText,
          },
          { onConflict: "stream_id,language,source" },
        )
        .select("id")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "failed to upsert transcript");
      }

      return { transcriptId: data.id };
    }),

  buildUtterances: publicProcedure
    .input(z.object({ streamId: streamIdSchema }))
    .output(buildOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { utteranceBuilder } = requireServices(ctx);

      const { data: transcript, error } = await supabaseServer
        .from("transcripts")
        .select("id, raw_text")
        .eq("stream_id", input.streamId)
        .is("disabled_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !transcript) {
        throw new Error(error?.message ?? "transcript not found");
      }

      const utterances = utteranceBuilder.buildFromTranscript(transcript.raw_text);
      const rows = utterances.map((u) => ({
        stream_id: input.streamId,
        start_sec: u.startSec,
        end_sec: u.endSec,
        text: u.text,
        normalized_text: null,
        analysis_status: "pending",
      }));

      if (rows.length === 0) {
        return { utterancesCreated: 0 };
      }

      const { error: upsertErr } = await supabaseServer
        .from("utterances")
        .upsert(rows, {
          onConflict: "stream_id,start_sec,end_sec,text",
          ignoreDuplicates: true,
        });

      if (upsertErr) {
        throw new Error(upsertErr.message);
      }

      return { utterancesCreated: rows.length };
    }),

  normalizeUtterances: publicProcedure
    .input(
      z.object({
        streamId: streamIdSchema,
        limit: z.number().min(1).max(500).optional().default(200),
      }),
    )
    .output(normalizeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { utteranceBuilder } = requireServices(ctx);

      const { data: utterances, error } = await supabaseServer
        .from("utterances")
        .select("id, text")
        .eq("stream_id", input.streamId)
        .is("disabled_at", null)
        .is("normalized_text", null)
        .limit(input.limit);

      if (error) {
        throw new Error(error.message);
      }

      let normalized = 0;
      for (const utterance of utterances ?? []) {
        const normalizedText = await utteranceBuilder.normalize(utterance.text);
        const { error: updateErr } = await supabaseServer
          .from("utterances")
          .update({
            normalized_text: normalizedText,
            analysis_status: "done",
          })
          .eq("id", utterance.id);

        if (updateErr) {
          throw new Error(updateErr.message);
        }
        normalized += 1;
      }

      return { normalized };
    }),

  generateClips: publicProcedure
    .input(z.object({ streamId: streamIdSchema }))
    .output(clipsOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { clipGenerator } = requireServices(ctx);

      const { data: utterances, error } = await supabaseServer
        .from("utterances")
        .select("start_sec, end_sec, text, normalized_text")
        .eq("stream_id", input.streamId)
        .is("disabled_at", null)
        .eq("analysis_status", "done");

      if (error) {
        throw new Error(error.message);
      }

      const clipInputs = clipGenerator.generate(
        (utterances ?? []).map((u) => ({
          startSec: u.start_sec,
          endSec: u.end_sec,
          text: u.text,
          normalizedText: u.normalized_text,
        })),
      );

      const rows = clipInputs.map((clip) => ({
        stream_id: input.streamId,
        start_sec: clip.startSec,
        end_sec: clip.endSec,
        keywords: clip.keywords,
        note: clip.note,
      }));

      if (rows.length === 0) {
        return { clipsCreated: 0 };
      }

      const { error: upsertErr } = await supabaseServer
        .from("clips")
        .upsert(rows, {
          onConflict: "stream_id,start_sec,end_sec",
          ignoreDuplicates: true,
        });

      if (upsertErr) {
        throw new Error(upsertErr.message);
      }

      return { clipsCreated: rows.length };
    }),

  getIngestStatus: publicProcedure
    .input(z.object({ streamId: streamIdSchema }))
    .output(ingestStatusSchema)
    .query(async ({ input }) => {
      const { count: utterancesTotal, error: totalErr } = await supabaseServer
        .from("utterances")
        .select("*", { count: "exact", head: true })
        .eq("stream_id", input.streamId)
        .is("disabled_at", null);

      if (totalErr) {
        throw new Error(totalErr.message);
      }

      const { count: utterancesNormalized, error: normalizedErr } = await supabaseServer
        .from("utterances")
        .select("*", { count: "exact", head: true })
        .eq("stream_id", input.streamId)
        .is("disabled_at", null)
        .not("normalized_text", "is", null);

      if (normalizedErr) {
        throw new Error(normalizedErr.message);
      }

      const { count: clipsCount, error: clipsErr } = await supabaseServer
        .from("clips")
        .select("*", { count: "exact", head: true })
        .eq("stream_id", input.streamId)
        .is("disabled_at", null);

      if (clipsErr) {
        throw new Error(clipsErr.message);
      }

      const total = utterancesTotal ?? 0;
      const normalized = utterancesNormalized ?? 0;
      const clips = clipsCount ?? 0;

      let status: "queued" | "processing" | "done" = "queued";
      if (total > 0 && normalized < total) {
        status = "processing";
      } else if (total > 0 && normalized >= total && clips > 0) {
        status = "done";
      } else if (total > 0) {
        status = "processing";
      }

      return {
        utterancesTotal: total,
        utterancesNormalized: normalized,
        clipsCount: clips,
        status,
      };
    }),

  listClips: publicProcedure
    .input(z.object({ streamId: streamIdSchema }))
    .output(listClipsOutputSchema)
    .query(async ({ input }) => {
      const { data, error } = await supabaseServer
        .from("clips")
        .select("start_sec, end_sec, keywords, note")
        .eq("stream_id", input.streamId)
        .is("disabled_at", null)
        .order("start_sec", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return {
        clips:
          data?.map((clip) => ({
            startSec: clip.start_sec,
            endSec: clip.end_sec,
            keywords: clip.keywords ?? [],
            note: clip.note ?? null,
          })) ?? [],
      };
    }),
});
