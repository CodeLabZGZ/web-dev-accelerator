import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web Dev Accelerator: Code, Build, and Deploy",
  description: `
  Este workshop está inspirado en uno de los retos del NASA Space Apps 2023, en el cual se planteó la creación de una herramienta para conectar a creadores de proyectos de ciencia abierta con colaboradores que posean las habilidades necesarias para contribuir. Nuestro objetivo será desarrollar una aplicación sencilla que facilite esta conexión, ayudando a que personas interesadas en proyectos de código abierto puedan encontrar oportunidades de colaboración de manera eficiente.
  
  Además, este workshop está diseñado para sentar una base tecnológica que será de gran utilidad en el desarrollo de asignaturas como Sistemas de Información y Proyecto Software, e incluso podrá ser relevante para Sistemas y Tecnologías Web. Nos enfocaremos en las tecnologías clave que permitirán a los participantes adquirir habilidades prácticas que podrán aplicar en sus futuros proyectos académicos y profesionales.
  `,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
