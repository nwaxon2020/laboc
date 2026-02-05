import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Toaster } from 'react-hot-toast';

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NewsSection from '@/components/NewsSection';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Laboc Funeral Services - Compassionate Care When You Need It Most',
  description: 'Providing dignified funeral services with compassion and professionalism',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <NewsSection/>
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}