import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Inverter',
  description: 'Invert your images online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}