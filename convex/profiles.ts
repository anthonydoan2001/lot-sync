import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return {
      id: userId as unknown as string,
      email: (user as { email?: string | null }).email ?? null,
      displayName: (user as { name?: string | null }).name ?? null,
    };
  },
});
