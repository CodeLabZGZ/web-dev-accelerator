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
import { MultiSelect } from "@/components/ui/multi-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import EDUCATIONAL_LEVELS from "@/lib/data/educational-levels.json"
import JOBS_POSITIONS from "@/lib/data/job-positions.json"
import PROGRAMMING_LANGUAGES from "@/lib/data/programming-languages.json"
import SECTORS from "@/lib/data/sectors.json"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z
  .object({
    firstName: z.string().min(1).max(20),
    lastName: z.string().min(1).max(20),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    educationalLevel: z.enum(EDUCATIONAL_LEVELS as [string, ...string[]]),
    favoriteProgrammingLanguage: z.enum(
      PROGRAMMING_LANGUAGES as [string, ...string[]]
    ),
    desiredJobPosition: z.enum(JOBS_POSITIONS as [string, ...string[]]),
    desiredSectors: z.array(z.string())
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"] // El error se asignará a este campo
  })

export default function Login() {
  const router = useRouter()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      desiredSectors: []
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })

    toast.promise(promise, {
      loading: "Processing your request. Please wait a moment.",
      success: () => {
        router.push("/auth/login")
        return "Your request was successfully completed."
      },
      error:
        "An error occurred while processing your request. Please try again."
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5">
        <h1 className="text-xl font-semibold leading-none tracking-tight">
          Create your account
        </h1>
        <h2 className="text-base">
          Join us today and take control of your projects.
        </h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-x-6">
            <section className="max-w-sm space-y-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
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
                    <FormLabel>Create Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Choose a strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section className="max-w-sm space-y-3">
              <FormField
                control={form.control}
                name="educationalLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Educational Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EDUCATIONAL_LEVELS.map(value => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="favoriteProgrammingLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Programming Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your favorite language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROGRAMMING_LANGUAGES.map(value => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredJobPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Job Position</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your job position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOBS_POSITIONS.map(value => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="desiredSectors"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Sector</FormLabel>
                    <MultiSelect
                      options={SECTORS.map(value => ({
                        label: value,
                        value
                      }))}
                      onValueChange={value => field.onChange(value)}
                      value={field.value || []}
                      placeholder="Select the sectors you're interested in"
                      variant="inverted"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          <Button type="submit">Sign Up</Button>
        </form>
      </Form>
      <p className="text-left text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className={buttonVariants({ variant: "link" })}
        >
          Log in here
        </Link>
      </p>
    </div>
  )
}
