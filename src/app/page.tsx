import { auth } from "@/auth"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { VotesButton } from "@/components/votes-button"
import { renderPrice } from "@/lib/formatters"
import { addSecond } from "@formkit/tempo"
import Image from "next/image"
import Link from "next/link"
const fallback =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"

export default async function Home() {
  const session = await auth()
  const projects = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
    .then(res => res.json())
    .then(res => res.data)

  return (
    <Table>
      <TableCaption>
        <Link href={session ? "/projects" : "/auth/register"}>
          See all projects
        </Link>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Top Projects</TableHead>
          <TableHead align="right" className="text-right">
            Featured All
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map(project => (
          <TableRow key={`${project.company}-${project.offer}`}>
            <TableCell className="flex items-center gap-x-2.5">
              <div className="h-14 w-14">
                <AspectRatio>
                  <Image
                    src={project.image || fallback}
                    alt="Photo by Drew Beamer"
                    fill
                    className="h-full w-full rounded-sm object-cover"
                  />
                </AspectRatio>
              </div>
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-2">
                  <span className="font-semibold leading-none tracking-tight">
                    {project.company}
                  </span>
                  <span className="opacity-50">—</span>
                  <span className="text-sm text-gray-600">{project.offer}</span>
                </div>
                <div className="flex items-center gap-x-1">
                  {project.stickingTime &&
                    addSecond(
                      new Date(project.createdAt),
                      project.stickingTime
                    ) > new Date() && (
                      <Badge variant="outline" className="text-xs">
                        promoted
                      </Badge>
                    )}
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {project.minSalary &&
                      renderPrice(project.minSalary, "es-ES", "EUR")}{" "}
                    -{" "}
                    {project.maxSalary &&
                      renderPrice(project.maxSalary, "es-ES", "EUR")}
                  </span>
                  <span className="opacity-25">•</span>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {project.location}
                  </span>
                  {project?.tags?.map(tag => (
                    <>
                      <span className="opacity-25">•</span>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {tag}
                      </span>
                    </>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell align="right">
              <VotesButton id={project.id} votes={project.votes} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
