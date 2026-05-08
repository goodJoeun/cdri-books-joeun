import type { Metadata } from 'next'
import { Providers } from './providers'
import Header from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'certicos-books',
  description: 'CERTICOS BOOKS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-white">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
