import EDUCATIONAL_LEVELS from "@/lib/data/educational-levels.json"
import JOBS_POSITIONS from "@/lib/data/job-positions.json"
import PROGRAMMING_LANGUAGES from "@/lib/data/programming-languages.json"
import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Define the 'users' table schema
export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  password: text("password"),
  salt: text("salt"),
  highestEducationalLevel: text("highestEducationalLevel", {
    enum: EDUCATIONAL_LEVELS as [string, ...string[]]
  }),
  favoriteProgrammingLanguage: text("favoriteProgrammingLanguage", {
    enum: PROGRAMMING_LANGUAGES as [string, ...string[]]
  }),
  desiredJobPosition: text("desiredJobPosition", {
    enum: JOBS_POSITIONS as [string, ...string[]]
  }),
  desiredSectors: text("desiredSectors", { mode: "json" }),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(users)

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users)
