import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const themeInitScript = `
  const savedTheme = localStorage.getItem("market-pulse-theme")
  if (savedTheme === "light") {
    document.documentElement.dataset.theme = "light"
    document.documentElement.classList.remove("dark")
  }
`

export const metadata: Metadata = {
  title: "Market Pulse — Institutional Pre-Market Intelligence & Trading Terminal",
  description:
    "Institutional pre-market intelligence, discipline-scoring analytics, and automated trade journaling built specifically for disciplined Indian equity & options traders.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" className={`dark ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-surface-base text-text-primary antialiased selection:bg-accent-blue/20 selection:text-accent-blue">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
