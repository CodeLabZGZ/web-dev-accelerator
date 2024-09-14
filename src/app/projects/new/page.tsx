"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { TAGS } from "@/db/seed"
import { renderPrice } from "@/lib/formatters"
import { genSalaryRange } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z
  .object({
    offer: z
      .string()
      .min(2, "Offer must be at least 2 characters")
      .max(50, "Offer must be at most 50 characters"),
    company: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(50, "Company name must be at most 50 characters"),
    tags: z.array(z.string()).max(3),
    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(50, "Location must be at most 50 characters"),
    link: z
      .string()
      .url("Must be a valid URL")
      .startsWith("https://", "Link must start with 'https://'"),
    minSalary: z
      .string()
      .refine(value => !isNaN(Number(value)), {
        message: "Minimum salary must be a valid number"
      })
      .transform(value => Number(value))
      .optional(),
    maxSalary: z
      .string()
      .refine(value => !isNaN(Number(value)), {
        message: "Maximum salary must be a valid number"
      })
      .transform(value => Number(value))
      .optional(),
    stickingTime: z.enum(
      ["No sticky", "24 hours", "7 days", "14 days", "30 days"],
      { message: "Sticking time must be one of the specified options" }
    ),
    image: z
      .string()
      .url("Must be a valid URL")
      .startsWith("https://", "Image URL must start with 'https://'")
      .optional()
  })
  // Ensure that if one salary is defined, the other must be too
  .refine(
    data =>
      (data.minSalary !== undefined && data.maxSalary !== undefined) ||
      (data.minSalary === undefined && data.maxSalary === undefined),
    {
      message:
        "Both minimum salary and maximum salary must be provided if one is set",
      path: ["minSalary", "maxSalary"]
    }
  )
  // Ensure that minSalary is less than maxSalary if both are provided
  .refine(
    data =>
      data.minSalary === undefined ||
      data.maxSalary === undefined ||
      data.minSalary < data.maxSalary,
    {
      message: "Minimum salary must be less than maximum salary",
      path: ["minSalary"]
    }
  )

export default function NewProject() {
  const [selectedLogo, setSelectedLogo] = useState<boolean>(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stickingTime: "No sticky"
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })

    toast.promise(promise, {
      loading: "Loading...",
      success: "ok",
      error: "Error"
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="offer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Offer Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="tags"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <MultiSelect
                    options={TAGS.map(value => ({ label: value, value }))}
                    onValueChange={value => field.onChange(value)}
                    value={field.value || []}
                    placeholder="Select the tags for the offer"
                    variant="inverted"
                    maxCount={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    We recommend Remote. If you restrict your job to a location,
                    you will get 10x-20x less applicants on average.
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Location (Remote|On-site|Hybrid or/and City, Country)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Apply URLs with a form which an applicant can fill out
                    generally receive a lot more applicants compared to apply by
                    email.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Apply url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDescription>
              Tip: Offers with salaries have more views. (OPTIONAL)
            </FormDescription>
            <div className="grid grid-cols-2 items-start gap-x-4">
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a min yearly salary" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genSalaryRange(0, 400000, 5000).map(value => (
                          <SelectItem key={value} value={String(value)}>
                            {renderPrice(value, "es-ES", "EUR")}
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
                name="maxSalary"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a max yearly salary" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genSalaryRange(0, 400000, 5000).map(value => (
                          <SelectItem key={value} value={String(value)}>
                            {renderPrice(value, "es-ES", "EUR")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="stickingTime"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Sticky your post to the top for:</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1"
                      defaultValue={String(field.value)}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="No sticky" />
                        </FormControl>
                        <FormLabel className="font-normal">No sticky</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={"24 hours"} />
                        </FormControl>
                        <FormLabel className="font-normal">24 hours</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={"7 days"} />
                        </FormControl>
                        <FormLabel className="font-normal">7 days</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={"14 days"} />
                        </FormControl>
                        <FormLabel className="font-normal">14 days</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={"30 days"} />
                        </FormControl>
                        <FormLabel className="font-normal">30 days</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="items-top flex space-x-2">
              <Checkbox
                id="add-image"
                onCheckedChange={e => setSelectedLogo(Boolean(e))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="add-image"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Add a logo to your offer
                </label>
              </div>
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="https://codelabzgz.dev/static/codelabzgz-logo.png"
                      {...field}
                      disabled={!selectedLogo}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary" className="w-full">
              Deploy
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
