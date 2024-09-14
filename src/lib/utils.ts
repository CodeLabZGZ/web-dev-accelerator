import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
