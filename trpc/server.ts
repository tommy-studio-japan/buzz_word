// trpc/server.ts
export const api = {
  streams: {
    list: async (_input: { limit: number }) => {
      return [];
    },
  },
};