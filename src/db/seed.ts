import { faker } from "@faker-js/faker"
import { addSecond } from "@formkit/tempo"

export const TAGS = [
  "frontend developer",
  "backend developer",
  "fullstack developer",
  "DevOps engineer",
  "QA engineer",
  "pentester",
  "security engineer",
  "cloud architect",
  "software engineer",
  "test automation engineer",
  "mobile developer",
  "iOS developer",
  "Android developer",
  "UI/UX designer",
  "data engineer",
  "data scientist",
  "machine learning engineer",
  "AI specialist",
  "blockchain developer",
  "cybersecurity analyst",
  "site reliability engineer (SRE)",
  "system administrator",
  "network engineer",
  "database administrator (DBA)",
  "game developer",
  "VR/AR developer",
  "product manager",
  "technical lead",
  "scrum master",
  "release manager",
  "software architect",
  "test engineer",
  "functional tester",
  "performance tester",
  "accessibility specialist",
  "React developer",
  "Angular developer",
  "Vue.js developer",
  "Node.js developer",
  "Python developer",
  "Java developer",
  "C# developer",
  ".NET developer",
  "PHP developer",
  "Ruby on Rails developer",
  "Go developer",
  "Rust developer",
  "Kotlin developer",
  "Scala developer",
  "Flutter developer",
  "Swift developer",
  "GraphQL developer",
  "Docker engineer",
  "Kubernetes specialist",
  "AWS engineer",
  "Azure engineer",
  "GCP engineer",
  "CI/CD specialist",
  "microservices architect",
  "API developer",
  "network security engineer",
  "ethical hacker",
  "penetration tester",
  "automation engineer",
  "integration engineer",
  "IoT developer",
  "Embedded systems engineer",
  "robotics engineer",
  "business analyst",
  "tech support engineer",
  "IT consultant",
  "software project manager"
]

// Función para determinar si un proyecto está dentro de su período de fijación
const isWithinStickingPeriod = (
  project: Project,
  currentDate: Date
): boolean => {
  const endDate = addSecond(new Date(project.createdAt), project.stickingTime)
  return endDate > currentDate || endDate.getTime() === currentDate.getTime()
}

interface Project {
  image: string
  company: string
  offer: string
  location: string
  link: string
  votes: number
  minSalary: number
  maxSalary: number
  tags: string[]
  stickingTime: number
  createdAt: number
  updatedAt: number
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
    createdAt: faker.date.recent({ days: 20 }).getTime(),
    updatedAt: faker.date.recent().getTime()
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
    return b.votes - a.votes
  } else {
    // Ambos están expirados, ordenar por votos en orden descendente
    return b.votes - a.votes
  }
})
