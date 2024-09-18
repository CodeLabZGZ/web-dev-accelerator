import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const projects = sqliteTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  image: text("image"),
  company: text("company").notNull(),
  offer: text("offer").notNull(),
  location: text("location").notNull(),
  link: text("link").notNull(),
  votes: integer("votes").default(0),
  minSalary: integer("min_salary"),
  maxSalary: integer("max_salary"),
  tags: text("tags", { mode: "json" }),
  stickingTime: integer("sticking_time").default(0),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Schema for inserting a project - can be used to validate API requests
export const insertProjectSchema = createInsertSchema(projects, {
  tags: z.array(z.string())
})
export type InsertProject = z.infer<typeof insertProjectSchema>

// Schema for selecting a project - can be used to validate API responses
export const selectProjectSchema = createSelectSchema(projects, {
  tags: z.array(z.string())
})
export type Project = z.infer<typeof selectProjectSchema>
