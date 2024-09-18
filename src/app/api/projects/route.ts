import { auth } from "@/auth"
import { db } from "@/db/db"
import { projects } from "@/db/schemas/projects"
import { isWithinStickingPeriod } from "@/db/seed"
import { response } from "@/lib/utils"
import { z } from "zod"

async function getHandler() {
  const currentDate = new Date()
  const rows = await db.select().from(projects)
  const data = rows.sort((a: any, b: any) => {
    // Determinar si cada proyecto está activo o expirado
    const isAActive = isWithinStickingPeriod(a, currentDate)
    const isBActive = isWithinStickingPeriod(b, currentDate)

    if (isAActive && !isBActive) {
      // Proyecto A está activo y B está expirado => A va primero
      return -1
    } else if (!isAActive && isBActive) {
      // Proyecto B está activo y A está expirado => B va primero
      return 1
    } else if (isAActive && isBActive) {
      // Ambos están activos, ordenar por votos en orden descendente
      return (b.votes ?? 0) - (a.votes ?? 0)
    } else {
      // Ambos están expirados, ordenar por votos en orden descendente
      return (b.votes ?? 0) - (a.votes ?? 0)
    }
  })

  return response({ data })
}

const bodySchema = z
  .object({
    offer: z
      .string()
      .min(2, "Offer must be at least 2 characters")
      .max(50, "Offer must be at most 50 characters"),
    company: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(50, "Company name must be at most 50 characters"),
    tags: z.array(z.string()).max(3),
    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(50, "Location must be at most 50 characters"),
    link: z
      .string()
      .url("Must be a valid URL")
      .startsWith("https://", "Link must start with 'https://'"),
    minSalary: z.number().int().positive().optional(),
    maxSalary: z.number().int().positive().optional(),
    stickingTime: z.enum(
      ["No sticky", "24 hours", "7 days", "14 days", "30 days"],
      { message: "Sticking time must be one of the specified options" }
    ),
    image: z
      .string()
      .url("Must be a valid URL")
      .startsWith("https://", "Image URL must start with 'https://'")
      .optional()
  })
  // Ensure that if one salary is defined, the other must be too
  .refine(
    data =>
      (data.minSalary !== undefined && data.maxSalary !== undefined) ||
      (data.minSalary === undefined && data.maxSalary === undefined),
    {
      message:
        "Both minimum salary and maximum salary must be provided if one is set",
      path: ["minSalary", "maxSalary"]
    }
  )

async function postHandler(request: Request) {
  try {
    // Parse the JSON request body
    const data = await request.json()

    // Validate and parse the data
    const result = bodySchema.safeParse(data)
    if (!result.success) {
      // Return an error response if validation fails
      return response({ message: result.error.message, code: 400 })
    }

    const safeData: any = result.data

    // Insert the data into the database
    const rows = await db.insert(projects).values(safeData).returning()

    // Return the response with the inserted data
    return response({ data: rows[0], code: 201 })
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error)
    return response({ message: "An unexpected error occurred", code: 500 })
  }
}

export const GET = getHandler
export const POST = auth(postHandler)
