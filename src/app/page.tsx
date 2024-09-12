import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { projects } from "@/db/seed"
import { renderPrice } from "@/lib/formatters"
import { addSecond } from "@formkit/tempo"
import { TriangleUpIcon } from "@radix-ui/react-icons"
import Image from "next/image"

const fallback =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"

export default function Home() {
  return (
    <div className="w-screen">
      <div className="mx-auto max-w-3xl py-16">
        <Table>
          <TableCaption>See all projects</TableCaption>
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
                      <span className="text-sm text-gray-600">
                        {project.offer}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1">
                      {addSecond(
                        new Date(project.createdAt),
                        project.stickingTime
                      ) > new Date() && (
                        <Badge variant="outline" className="text-xs">
                          promoted
                        </Badge>
                      )}
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {renderPrice(project.minSalary, "es-ES", "EUR")} -{" "}
                        {renderPrice(project.maxSalary, "es-ES", "EUR")}
                      </span>
                      <span className="opacity-25">•</span>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {project.location}
                      </span>
                      {project.tags.map(tag => (
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
                  <Button
                    variant="outline"
                    className="flex h-14 w-14 flex-col items-center justify-center -space-y-2 rounded"
                  >
                    <TriangleUpIcon className="h-8 w-8 text-gray-600 transition-colors" />
                    <span className="text-xs font-semibold text-gray-800">
                      {project.votes}
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
