import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tag Along | Compartí tu viaje en Argentina",
  description:
    "Conectamos conductores con pasajeros para compartir viajes en Argentina de manera económica, ecológica y social.",
  keywords: "viajes compartidos, carpooling, Argentina, compartir auto, viajes económicos",
  authors: [{ name: "Tag Along" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://tagalong.com.ar",
    title: "Tag Along | Compartí tu viaje en Argentina",
    description: "Conectamos conductores con pasajeros para compartir viajes en Argentina",
    siteName: "Tag Along",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
