"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export default function Login() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Sign in with the provided credentials.
    const result = await signIn("credentials", {
      ...values,
      callbackUrl: "/"
    })

    if (result?.error) {
      console.error("Login failed:", result.error)
      // You can add some state to display error messages to the user here
    } else {
      // Redirect to the specified URL
      window.location.href = "/"
    }
  }

  return (
    <div className="max-w-sm space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-xl font-semibold leading-none tracking-tight">
          Login to your account
        </h1>
        <h2 className="text-base">
          Access your dashboard and manage your projects.
        </h2>
      </div>
      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your-email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
      <p className="text-left text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className={buttonVariants({ variant: "link" })}
        >
          Sign up here
        </Link>
      </p>
    </div>
  )
}
