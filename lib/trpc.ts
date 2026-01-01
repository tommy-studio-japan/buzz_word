
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

// React hooks + typed client factory
export const trpc = createTRPCReact<AppRouter>();

/**
 * Returns the base URL for tRPC depending on environment.
 * - Browser: relative URL
 * - Server (SSR): absolute URL
 */
function getBaseUrl() {
  if (typeof window !== "undefined") return "";

  // If deployed on Vercel, use the provided URL.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Fallback to localhost during local dev.
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Create a tRPC client that uses POST (via httpBatchLink) so inputs are sent in the request body
 * instead of query strings.
 */
export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
  });
}
