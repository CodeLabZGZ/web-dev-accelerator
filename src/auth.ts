import { db } from "@/db/db"
import { saltAndHashPassword } from "@/lib/password"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { users } from "./db/schemas/users"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async credentials => {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required")
        }

        // Fetch user from database
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))

        console.log(user)

        if (!user) {
          throw new Error("User not found")
        }

        // Verify the provided password against the stored hash
        const { hash } = await saltAndHashPassword(
          credentials.password,
          user.salt
        )
        if (hash !== user.password) {
          throw new Error("Credentials mismatch")
        }

        console.log("asd")
        // Return user details
        return {
          id: user.id,
          image: user.image,
          name: user.name,
          email: user.email
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.uid
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.uid = user.id
      }
      return token
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirect here if there's an error
    newUser: "/" // Will disable the new account creation screen
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  debug: process.env.NODE_ENV !== "production"
})
