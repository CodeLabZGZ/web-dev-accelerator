import { auth } from "@/auth"
import { db } from "@/db/db"
import { projects } from "@/db/schemas/projects"
import { response } from "@/lib/utils"
import { eq, sql } from "drizzle-orm"
import { NextRequest } from "next/server"

async function updateHandler(request: NextRequest, context) {
  console.log(context.params.id)
  const projectId = context.params.id
  const [item] = await db
    .update(projects)
    .set({ votes: sql`votes + 1` })
    .where(eq(projects.id, projectId))
    .returning()

  return response({ data: item, code: 200 })
}

export const PATCH = auth(updateHandler)
