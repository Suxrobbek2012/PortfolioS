import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { AiChat } from '@/components/ui/AiChat'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3001'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Suhrobbek Baxtiyorov — Full Stack Developer & UI/UX Designer',
    template: '%s | Suhrobbek Baxtiyorov',
  },
  description:
    'Full Stack Developer & UI/UX Designer based in Tashkent, Uzbekistan. I build fast, beautiful, and scalable web applications using React, Next.js, TypeScript, and Node.js.',
  keywords: [
    'Full Stack Developer', 'UI/UX Designer', 'React Developer', 'Next.js Developer',
    'TypeScript', 'Node.js', 'Web Developer Tashkent', 'Uzbekistan Developer',
    'Freelance Developer', 'Frontend Developer', 'Backend Developer',
    'Suhrobbek Baxtiyorov', 'Portfolio',
  ],
  authors: [{ name: 'Suhrobbek Baxtiyorov', url: BASE_URL }],
  creator: 'Suhrobbek Baxtiyorov',
  publisher: 'Suhrobbek Baxtiyorov',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: 'Suhrobbek Baxtiyorov — Full Stack Developer & UI/UX Designer',
    description: 'Full Stack Developer & UI/UX Designer based in Tashkent, Uzbekistan. Building fast, beautiful, and scalable web applications.',
    siteName: 'Suhrobbek Baxtiyorov Portfolio',
    images: [
      {
        url: `${BASE_URL}/api/og?title=Suhrobbek+Baxtiyorov&subtitle=Full+Stack+Developer+%26+UI%2FUX+Designer`,
        width: 1200,
        height: 630,
        alt: 'Suhrobbek Baxtiyorov — Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Suhrobbek Baxtiyorov — Full Stack Developer',
    description: 'Full Stack Developer & UI/UX Designer based in Tashkent, Uzbekistan.',
    images: [`${BASE_URL}/api/og?title=Suhrobbek+Baxtiyorov&subtitle=Full+Stack+Developer`],
    creator: '@suhrobbek',
    site: '@suhrobbek',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
}

// JSON-LD Structured Data
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Suhrobbek Baxtiyorov',
  url: BASE_URL,
  image: `${BASE_URL}/api/og?title=Suhrobbek+Baxtiyorov`,
  sameAs: [
    'https://github.com/suhrobbek',
    'https://linkedin.com/in/suhrobbek',
    'https://twitter.com/suhrobbek',
  ],
  jobTitle: 'Full Stack Developer & UI/UX Designer',
  worksFor: {
    '@type': 'Organization',
    name: 'TechCorp Tashkent',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tashkent',
    addressCountry: 'UZ',
  },
  email: 'suhrobbek@portfolio.dev',
  knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'UI/UX Design', 'Web Development'],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Suhrobbek Baxtiyorov Portfolio',
  url: BASE_URL,
  description: 'Full Stack Developer & UI/UX Designer portfolio',
  author: { '@type': 'Person', name: 'Suhrobbek Baxtiyorov' },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark-neon">
      <head>
        {/* Prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('portfolio-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff88" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <AiChat />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
