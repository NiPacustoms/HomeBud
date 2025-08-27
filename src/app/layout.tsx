import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from 'react-hot-toast'
// import BottomNavigation from '@/components/navigation/BottomNavigation'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true, // Behalten Sie das Preloading, aber nur für kritische Schriftarten
  fallback: ['system-ui', 'arial'], // Fallback-Schriftarten hinzufügen
})

export const metadata: Metadata = {
  title: 'HomeBud - Intelligentes Grow Management',
  description: 'Die moderne App für professionelles Cannabis-Grow-Management mit KI-Unterstützung, Monitoring und Community-Features.',
  keywords: 'Cannabis, Grow, Management, KI, Monitoring, Community, HomeBud',
  authors: [{ name: 'HomeBud Team' }],
  creator: 'HomeBud',
  publisher: 'HomeBud',
  icons: {
    icon: [
      { url: '/Design ohne Titel (25).png', sizes: '32x32', type: 'image/png' },
      { url: '/Design ohne Titel (25).png', sizes: '64x64', type: 'image/png' },
      { url: '/Design ohne Titel (25).png', sizes: '128x128', type: 'image/png' },
    ],
    shortcut: '/Design ohne Titel (25).png',
    apple: '/Design ohne Titel (25).png',
  },
  themeColor: '#22c55e',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://homebud.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HomeBud - Intelligentes Grow Management',
    description: 'Die moderne App für professionelles Cannabis-Grow-Management mit KI-Unterstützung.',
    url: 'https://homebud.app',
    siteName: 'HomeBud',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'HomeBud - Intelligentes Grow Management',
    description: 'Die moderne App für professionelles Cannabis-Grow-Management mit KI-Unterstützung.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          {/* <BottomNavigation /> */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
