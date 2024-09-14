import bcrypt from "bcrypt"

/**
 * Salts and hashes a password using bcrypt.
 *
 * This function generates a cryptographically secure salt and then hashes the given password using bcrypt.
 * If a salt is provided, it will be used; otherwise, a new salt will be generated.
 *
 * @param {string} password - The plain text password to be salted and hashed.
 * @param {string} [salt] - An optional salt to use for hashing. If not provided, a new salt will be generated.
 * @returns {Promise<{hash: string; salt: string}>} A promise that resolves to an object containing the hashed password and the salt used.
 *
 * @example
 * const result = await saltAndHashPassword("mySecretPassword");
 * // Returns an object like { hash: "$2b$10$...", salt: "$2b$10$..." }
 */
export async function saltAndHashPassword(
  password: string,
  salt?: string
): Promise<{ hash: string; salt: string }> {
  const saltRounds = 10 // Number of salting rounds. 10 is a good balance between security and performance.

  // Generate a new salt if none is provided
  const saltToUse = salt ?? (await bcrypt.genSalt(saltRounds))

  // Hash the password with the determined salt
  const hash = await bcrypt.hash(password, saltToUse)

  // Return both the hash and the salt
  return {
    hash,
    salt: saltToUse
  }
}
