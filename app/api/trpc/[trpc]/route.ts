import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";

/**
 * tRPC HTTP adapter (Next.js App Router)
 *
 * NOTE:
 * - `createContext` must return the per-request context object (`ctx`) that is injected into every tRPC procedure.
 * - Your routers currently expect these services on `ctx`:
 *   - ctx.youtube
 *   - ctx.utteranceBuilder
 *   - ctx.clipGenerator
 *
 * This file is intentionally kept “thin”: it should only bridge HTTP <-> tRPC.
 */

const YoutubeApiBase = "https://www.googleapis.com/youtube/v3";

function parseIso8601DurationToSec(iso: string | null | undefined): number | null {
  if (!iso) return null;
  // Examples: PT15M33S, PT1H2M3S, PT45S
  /**
   * 正規表現 (?:...)?でグループ化
   */
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return null;
  const h = m[1] ? Number(m[1]) : 0;
  const min = m[2] ? Number(m[2]) : 0;
  const s = m[3] ? Number(m[3]) : 0;
  return h * 3600 + min * 60 + s;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// Temporary minimal services for wiring.
// Replace the implementations as you build the real services.
const youtube = {
  parseUrl(url: string) {
    const u = new URL(url);
    const videoId = u.searchParams.get("v");
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }
    return { videoId };
  },

  async fetchMetadata(videoId: string) {
    const apiKey = requireEnv("YOUTUBE_DATA_API_KEY");

    // videos.list: snippet has title/channelId/channelName/publishedAt, contentDetails has duration.
    const url =
      `${YoutubeApiBase}/videos?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        `YouTube API error (videos.list): ${res.status} ${res.statusText} ${JSON.stringify(json)}`,
      );
    }

    const item = (json as any)?.items?.[0];
    if (!item) {
      throw new Error("YouTube API: video not found");
    }

    const snippet = item.snippet ?? {};
    const contentDetails = item.contentDetails ?? {};

    return {
      videoId,
      title: snippet.title ?? null,
      publishedAt: snippet.publishedAt ?? null,
      durationSec: parseIso8601DurationToSec(contentDetails.duration),
      // NOTE: live/scheduled/archive can be derived with liveStreamingDetails, but keep null for now.
      status: null as "live" | "scheduled" | "archive" | null,
      channelId: snippet.channelId ?? null,
      channelTitle: snippet.channelTitle ?? null,
    };
  },

  async fetchTranscript(_videoId: string) {
    throw new Error("youtube.fetchTranscript not implemented");
  },
};

const utteranceBuilder = {
  fromSegments(_segments: Array<{ start: number; end: number; text: string }>) {
    throw new Error(
      "utteranceBuilder.fromSegments is not implemented. Wire a real utteranceBuilder into createContext().",
    );
  },
};

const clipGenerator = {
  fromUtterances(
    _utterances: Array<{ start_sec: number; end_sec: number; text: string; normalized_text?: string | null }>,
  ) {
    throw new Error(
      "clipGenerator.fromUtterances is not implemented. Wire a real clipGenerator into createContext().",
    );
  },
};

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      // Log once per request to make debugging context wiring easy.
      // eslint-disable-next-line no-console
      console.log("[trpc] createContext keys:", ["youtube", "utteranceBuilder", "clipGenerator"]);

      return {
        youtube,
        utteranceBuilder,
        clipGenerator,
      };
    },
  });

export { handler as GET, handler as POST };
