"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { EnterIcon, ExitIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type Dispatch, type SetStateAction } from "react"

function handleTheme({
  state,
  setter
}: {
  state: string | undefined
  setter: Dispatch<SetStateAction<string>>
}) {
  if (state === "dark") setter("light")
  else setter("dark")
}

export default function Navbar() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { status } = useSession()

  return (
    <div className="container mx-auto flex max-w-3xl items-center justify-between py-4">
      <Link href="/" className="h-12 w-12">
        <AspectRatio>
          <Image
            src="https://avatars.githubusercontent.com/u/37885730?s=200&v=4"
            alt="Codelabzgz logo"
            fill
            className="z-50 h-full w-full object-cover"
          />
        </AspectRatio>
      </Link>
      <div className="flex items-center gap-x-1">
        <NavigationMenu className="mr-1">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href={
                  status === "authenticated"
                    ? "/projects/new"
                    : "/auth/register"
                }
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Post an Offer
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleTheme({ state: theme, setter: setTheme })}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {status !== "loading" && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              if (status === "unauthenticated") router.push("/auth/register")
              else signOut()
            }}
          >
            {status === "unauthenticated" ? <EnterIcon /> : <ExitIcon />}
          </Button>
        )}
      </div>
    </div>
  )
}
