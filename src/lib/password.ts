import bcrypt from "bcrypt";

export async function saltAndHashPassword(password: string) {
  const saltRounds = 10; // Número de rondas de salting. 10 es un buen equilibrio entre seguridad y rendimiento.

  // Generar un salt
  const salt = await bcrypt.genSalt(saltRounds);

  // Hashear la contraseña con el salt
  const hash = await bcrypt.hash(password, salt);

  return hash;
}
