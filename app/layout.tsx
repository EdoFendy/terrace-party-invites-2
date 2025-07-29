import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'

export const metadata: Metadata = {
  title: 'Terrace Party',
  description: 'Exclusive after-party on the terrace',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans font-light bg-gradient-light text-foreground antialiased min-h-screen tracking-tight">
        {children}
      </body>
    </html>
  )
}
