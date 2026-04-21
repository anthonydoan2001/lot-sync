import { getDb } from "@/server/db/client";
import { rowToAnnouncement, type Announcement } from "@/server/db/mappers";

export const announcementRepository = {
  get(): Announcement | null {
    const row = getDb()
      .prepare("SELECT * FROM announcements LIMIT 1")
      .get() as Parameters<typeof rowToAnnouncement>[0] | undefined;
    return row ? rowToAnnouncement(row) : null;
  },

  update(id: string, content: string): Announcement | null {
    getDb()
      .prepare(
        "UPDATE announcements SET content = ?, updated_at = ? WHERE id = ?",
      )
      .run(content, new Date().toISOString(), id);
    const row = getDb()
      .prepare("SELECT * FROM announcements WHERE id = ?")
      .get(id) as Parameters<typeof rowToAnnouncement>[0] | undefined;
    return row ? rowToAnnouncement(row) : null;
  },
};
