import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using `clsx` and `tailwind-merge`.
 *
 * This function helps conditionally combine class names while ensuring Tailwind CSS utility classes
 * are merged correctly, eliminating potential conflicts.
 *
 * @param {...ClassValue} inputs - A list of class names or conditional class names to merge.
 * @returns {string} A single merged class name string.
 *
 * @example
 * cn("bg-red-500", "text-white", isActive && "font-bold");
 * // Returns: "bg-red-500 text-white font-bold" if isActive is true.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a standardized JSON response for APIs.
 *
 * @param {Object} params - The response parameters.
 * @param {any} params.data - The data to be included in the response body (optional).
 * @param {number} [params.code=200] - The HTTP status code included in the response body.
 * @param {number} [params.statusCode] - An optional HTTP status code that overrides the `code` parameter for the HTTP response status.
 * @param {string} [params.message=""] - An optional additional message for the response.
 *
 * @returns {NextResponse} A formatted JSON response for the API.
 */
export const response = ({
  data,
  code = 200,
  statusCode,
  message = ""
}: {
  data?: any
  code?: number
  statusCode?: number
  message?: string
}) => {
  return NextResponse.json(
    {
      data,
      status: {
        code,
        message,
        timestamp: new Date().toISOString()
      }
    },
    { status: statusCode ?? code }
  )
}

/**
 * Generates an array of numbers representing a range of salaries.
 *
 * @param {number} n - The starting value of the salary range.
 * @param {number} m - The ending value of the salary range.
 * @param {number} offset - The step size or increment between salaries in the range.
 * @returns {number[]} An array of numbers representing the salary range.
 *
 * @example
 * genSalaryRange(30000, 50000, 5000);
 * // Returns: [30000, 35000, 40000, 45000, 50000]
 */
export function genSalaryRange(
  n: number,
  m: number,
  offset: number
): Array<number> {
  let lista = []

  offset = Math.abs(offset)

  for (let i = n; i <= m; i += offset) {
    lista.push(i)
  }

  return lista
}
