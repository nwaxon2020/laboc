import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Toaster } from 'react-hot-toast';

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NewsSection from '@/components/NewsSection';
import Chat from "@/components/layout/ChatBox";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Laboc Funeral Services - Compassionate Care When You Need It Most',
  description: 'Providing dignified funeral services with compassion and professionalism in Sagamu and beyond.',
  metadataBase: new URL('https://labocfuneralservices.vercel.app/'), 
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Laboc Funeral Services',
    description: 'Providing dignified funeral services with compassion and professionalism.',
    url: 'https://laboc-funeral-services.vercel.app',
    siteName: 'Laboc Funeral Services',
    images: [
      {
        url: 'https://res.cloudinary.com/dqm6hjihm/image/upload/v1770370317/ChatGPT_Image_Feb_6_2026_10_31_28_AM_jdc1d9.png', // Place your logo in /public folder with this name
        width: 1200,
        height: 630,
        alt: 'Laboc Funeral Services Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter (X)
  twitter: {
    card: 'summary_large_image',
    title: 'Laboc Funeral Services',
    description: 'Compassionate Care When You Need It Most.',
    images: ['https://res.cloudinary.com/dqm6hjihm/image/upload/v1770370317/ChatGPT_Image_Feb_6_2026_10_31_28_AM_jdc1d9.png'],
  },

  // Favicons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white`}>
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: '#0f172a',
              color: '#fff',
            },
          }}
        />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <NewsSection/>
        <Footer />
        <Chat />
      </body>
    </html>
  )
}