import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Removed Geist font; using global font-sans and minimal styles */}
      </head>
      <body className="font-sans bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
