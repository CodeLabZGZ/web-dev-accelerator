import { auth } from "@/auth"
import { response } from "@/lib/utils"

export async function updateHandler(request: Request) {
  return response({ code: 200 })
}

export const PATCH = auth(updateHandler)
