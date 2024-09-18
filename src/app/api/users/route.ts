import { db } from "@/db/db"
import { users } from "@/db/schemas/users"
import EDUCATIONAL_LEVELS from "@/lib/data/educational-levels.json"
import JOBS_POSITIONS from "@/lib/data/job-positions.json"
import PROGRAMMING_LANGUAGES from "@/lib/data/programming-languages.json"
import { saltAndHashPassword } from "@/lib/password"
import { response } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { z } from "zod"

// Ensure that EDUCATIONAL_LEVELS, JOBS_POSITIONS, and PROGRAMMING_LANGUAGES are arrays of strings
const bodySchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  educationalLevel: z.enum(EDUCATIONAL_LEVELS as [string, ...string[]]),
  favoriteProgrammingLanguage: z.enum(
    PROGRAMMING_LANGUAGES as [string, ...string[]]
  ),
  desiredJobPosition: z.enum(JOBS_POSITIONS as [string, ...string[]]),
  desiredSectors: z.array(z.string())
})

export async function POST(request: Request) {
  try {
    // Parse the JSON request body
    const data = await request.json()

    // Validate and parse the data
    const result = bodySchema.safeParse(data)
    if (!result.success) {
      // Return an error response if validation fails
      return response({ message: result.error.message, code: 400 })
    }

    const safeData = result.data

    // Hash the password
    const { hash, salt } = await saltAndHashPassword(safeData.password)

    // Prepare the values for insertion
    const { firstName, lastName, ...rest } = safeData
    const values = {
      ...rest,
      name: `${firstName} ${lastName}`,
      salt,
      password: hash
    }

    // Insert the data into the database
    const rows = await db.insert(users).values(values).returning()

    // Return the response with the inserted data
    return response({ data: rows[0], code: 201 })
  } catch (error: any) {
    console.log(error)
    // check if it's a drizzle error
    if (error.code === "SQLITE_CONSTRAINT") {
      // Catch error if row is in conflict
      return response({ message: "Email is already in use!", code: 409 })
    }

    // Handle unexpected errors
    return response({
      message: "An unexpected error occurred",
      code: 500
    })
  }
}

export async function DELETE(request: Request) {
  try {
    // Get the URL and extract the query parameters
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    // Check if id is in query
    if (!id) {
      return response({ message: "User ID required!", code: 400 })
    }

    // If you want to improve this handler, you can try to check if
    // the user exists before trying to delete it.
    // In order to do that, you can try to query the users table
    // with the user id, specifically using the db.query.users.findFirst() function
    // More info on https://orm.drizzle.team/docs/rqb#find-first

    // if the user doesn't exist, return a response with status code 409 here!

    // Delete user from database.
    // **NOTE** that we're not checking if the user exists.
    await db.delete(users).where(eq(users.id, id)).returning()

    // Return the response with no content
    return response({ code: 200 })
  } catch (error: any) {
    // Handle unexpected errors
    console.error("Unexpected error:", error)
    return response({ message: error.message, code: 500 })
  }
}
