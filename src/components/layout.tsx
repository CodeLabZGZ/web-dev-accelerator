import Navbar from "@/components/navbar"

export function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl py-8">{children}</div>
    </div>
  )
}
