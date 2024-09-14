import { db } from "@/db/db"
import { users } from "@/db/schemas/users"
import EDUCATIONAL_LEVELS from "@/lib/data/educational-levels.json"
import JOBS_POSITIONS from "@/lib/data/job-positions.json"
import PROGRAMMING_LANGUAGES from "@/lib/data/programming-languages.json"
import { saltAndHashPassword } from "@/lib/password"
import { response } from "@/lib/utils"
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
    console.log(values)

    // Insert the data into the database
    const rows = await db.insert(users).values(values).returning()

    // Return the response with the inserted data
    return response({ data: rows[0] })
  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error)
    return response({ message: "An unexpected error occurred", code: 500 })
  }
}
