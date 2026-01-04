import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/api/root";
import { randomUUID } from "crypto";

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
    const channelId = randomUUID();

    // いったんダミーでOK
    return {
      videoId,
      title: null,
      publishedAt: null,
      durationSec: null,
      status: "archive",
      channelId: channelId,
      channelName: "@test_channel"
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
