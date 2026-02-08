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
  /**
   * YouTube URL -> videoId extractor
   *
   * Supported patterns:
   * 1) https://www.youtube.com/watch?v=VIDEO_ID
   * 2) https://youtu.be/VIDEO_ID
   * 3) https://m.youtube.com/watch?v=VIDEO_ID
   * 4) https://www.youtube.com/shorts/VIDEO_ID
   * 5) https://www.youtube.com/live/VIDEO_ID
   * 6) https://www.youtube.com/embed/VIDEO_ID
   * 7) https://www.youtube.com/v/VIDEO_ID
   * 8) https://music.youtube.com/watch?v=VIDEO_ID
   * 9) https://gaming.youtube.com/watch?v=VIDEO_ID
   * 10) https://www.youtube-nocookie.com/embed/VIDEO_ID
   * 11) https://www.youtube.com/attribution_link?...&u=/watch%3Fv%3DVIDEO_ID...
   *
   * Not supported (explicitly rejected):
   * - https://www.youtube.com/clip/CLIP_ID (clip -> videoId requires extra API)
   * - https://www.youtube.com/playlist?list=... (playlist is not a video)
   *
   * Extraction steps:
   * A) If host is a known YouTube host:
   *    - If query has v=, use it
   *    - Else, parse path for /shorts/, /live/, /embed/, /v/
   *    - Else, if attribution_link, decode "u" and re-parse recursively
   * B) If host is youtu.be, take first path segment
   */
  parseUrl(url: string) {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "gaming.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (u.pathname.startsWith("/clip/")) {
        throw new Error("YouTube clip URL is not supported yet.");
      }
      if (u.pathname.startsWith("/playlist")) {
        throw new Error("YouTube playlist URL is not a video.");
      }

      videoId = u.searchParams.get("v");
      if (!videoId && u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.replace("/shorts/", "").split("/")[0] || null;
      }
      if (!videoId && u.pathname.startsWith("/embed/")) {
        videoId = u.pathname.replace("/embed/", "").split("/")[0] || null;
      }
      if (!videoId && u.pathname.startsWith("/live/")) {
        videoId = u.pathname.replace("/live/", "").split("/")[0] || null;
      }
      if (!videoId && u.pathname.startsWith("/v/")) {
        videoId = u.pathname.replace("/v/", "").split("/")[0] || null;
      }
      if (!videoId && u.pathname.startsWith("/attribution_link")) {
        const encoded = u.searchParams.get("u");
        if (encoded) {
          const decoded = decodeURIComponent(encoded);
          const next = decoded.startsWith("http")
            ? decoded
            : `https://www.youtube.com${decoded}`;
          return youtube.parseUrl(next);
        }
      }
    } else if (host === "youtu.be") {
      videoId = u.pathname.replace(/^\/+/, "").split("/")[0] || null;
    }

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

  async fetchChannelById(channelId: string) {
    const apiKey = requireEnv("YOUTUBE_DATA_API_KEY");
    const url =
      `${YoutubeApiBase}/channels?part=snippet&id=${encodeURIComponent(channelId)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url);
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        `YouTube API error (channels.list): ${res.status} ${res.statusText} ${JSON.stringify(json)}`,
      );
    }

    const item = (json as any)?.items?.[0];
    if (!item) {
      throw new Error("YouTube API: channel not found");
    }

    const snippet = item.snippet ?? {};
    const thumbnails = snippet.thumbnails ?? {};

    return {
      channelId: item.id as string,
      channelTitle: snippet.title ?? null,
      customUrl: snippet.customUrl ?? null,
      avatarUrl:
        thumbnails?.high?.url ??
        thumbnails?.medium?.url ??
        thumbnails?.default?.url ??
        null,
    };
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
