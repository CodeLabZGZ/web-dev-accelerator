import { Project } from "@/db/schemas/projects"
import EDUCATIONAL_LEVELS from "@/lib/data/educational-levels.json"
import JOBS_POSITIONS from "@/lib/data/job-positions.json"
import PROGRAMMING_LANGUAGES from "@/lib/data/programming-languages.json"
import SECTORS from "@/lib/data/sectors.json"
import { faker } from "@faker-js/faker"
import { addSecond } from "@formkit/tempo"

export const TAGS = [
  ...EDUCATIONAL_LEVELS,
  ...JOBS_POSITIONS,
  ...PROGRAMMING_LANGUAGES,
  ...SECTORS
]

/**
 * Determina si un proyecto está dentro del período de tiempo activo.
 *
 * @param {Project} project - El objeto del proyecto que contiene información sobre su fecha de creación y el tiempo de permanencia.
 * @param {Date} currentDate - La fecha y hora actuales a comparar con el período de tiempo del proyecto.
 * @returns {boolean} `true` si el proyecto está dentro del período de tiempo activo, `false` si está expirado.
 *
 * @example
 * const project = {
 *   createdAt: '2024-01-01T00:00:00Z',
 *   stickingTime: 3600 * 1000 // 1 hora en milisegundos
 * };
 * const currentDate = new Date('2024-01-01T00:30:00Z');
 * const result = isWithinStickingPeriod(project, currentDate);
 * console.log(result); // true
 */
export const isWithinStickingPeriod = (
  project: Project,
  currentDate: Date
): boolean => {
  const endDate = addSecond(new Date(project.createdAt), project.stickingTime!)
  return endDate > currentDate || endDate.getTime() === currentDate.getTime()
}

const generateProject = (): Project => {
  // Generar el salario mínimo
  const minSalary = faker.number.int({ min: 0, max: 385000, multipleOf: 5000 })

  // Asegurar que el salario máximo no sea superior a minSalary + 15k
  const maxSalary = faker.number.int({
    min: minSalary,
    max: minSalary + 15000,
    multipleOf: 5000
  })

  return {
    id: faker.string.uuid(),
    image: faker.image.urlPicsumPhotos({ height: 128, width: 128 }),
    company: faker.company.name(),
    offer: faker.company.catchPhrase(),
    location: faker.helpers.arrayElement(["remote", "on-site", "hybrid"]),
    link: faker.internet.url(),
    votes: faker.number.int({ min: 0, max: 1000 }),
    minSalary: minSalary, // Usar el salario mínimo generado
    maxSalary: maxSalary, // Usar el salario máximo dentro del rango
    tags: faker.helpers.arrayElements(
      TAGS,
      faker.number.int({ min: 0, max: 3 })
    ),
    stickingTime: faker.helpers.arrayElement([1, 7, 14, 30]) * 24 * 60 * 60, // seconds
    createdAt: faker.date.recent({ days: 20 }),
    updatedAt: faker.date.recent()
  }
}

const currentDate = new Date()

// Generar 10 proyectos
export const projects: Project[] = Array.from(
  { length: 10 },
  generateProject
).sort((a, b) => {
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
