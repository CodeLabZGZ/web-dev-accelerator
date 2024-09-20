"use client"

import { Button } from "@/components/ui/button"
import { TriangleUpIcon } from "@radix-ui/react-icons"

export function VotesButton({ id, votes }: { id: string; votes: number }) {
  function updateVotes() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
      method: "PATCH"
    })
  }

  return (
    <Button
      onClick={() => {
        updateVotes()
      }}
      variant="outline"
      className="flex h-14 w-14 flex-col items-center justify-center -space-y-2 rounded"
    >
      <TriangleUpIcon className="h-8 w-8 text-gray-600 transition-colors" />
      <span className="text-xs font-semibold text-gray-800">{votes}</span>
    </Button>
  )
}
