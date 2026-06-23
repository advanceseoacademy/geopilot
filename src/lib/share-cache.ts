import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const getCachedSharedAudit = unstable_cache(
  async (token: string) => {
    return db.sharedAudit.findUnique({
      where: { token },
      include: {
        audit: {
          include: {
            entities: { orderBy: { count: "desc" }, take: 20 },
            topics: true,
          },
        },
      },
    });
  },
  ["shared-audit"],
  { revalidate: 300, tags: ["shared-audit"] }
);
