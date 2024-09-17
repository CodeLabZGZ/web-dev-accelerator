import { users } from "@/db/schemas/users"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull()
})
