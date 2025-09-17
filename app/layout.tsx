import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { NotificationProvider } from "@/hooks/use-notifications"
import { Chatbox } from "@/components/chatbox"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
                  <AuthProvider>
          <NotificationProvider>
            <Header />
            {children}
            <Chatbox />
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
