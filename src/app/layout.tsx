import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './css/artists.css'
import './css/team.css'
import './css/joinTrend.css'
import './css/faq.css'
import './css/presale.css'
import './css/home.css'
import './css/home/artists.css'
import './css/footer.css'
import '@fontsource/unbounded'

import { AppWrapper } from '@/context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'In Real Art',
  description: 'Landing page In Real Art',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  )
}
