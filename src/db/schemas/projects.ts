import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: text("id"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
