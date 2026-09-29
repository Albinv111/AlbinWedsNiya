import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Italiana } from 'next/font/google'
import './globals.css'

const italiana = Italiana({ subsets: ['latin'], weight: '400', variable: '--font-italiana', display: 'swap' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000'

const title = 'Albin & Niya · Wedding Invitation · 07 November 2026'
const description =
  'You are warmly invited to witness the holy matrimony of Albin Varghese & Niya Dominic — Saturday, 7 November 2026, 11:00 AM at Salem Mar Thoma Syrian Church, Kayamkulam. Tap to open your invitation.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Albin & Niya wedding invitation', type: 'image/jpeg' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#07060a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${italiana.variable} ${cormorant.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
