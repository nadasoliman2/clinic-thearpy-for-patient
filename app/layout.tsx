import React from "react"
import type { Metadata } from 'next'

import Navbar from "./_components/navbar"
import Footer from "./_components/footer"
import './globals.css'
import { Cairo, Tajawal } from 'next/font/google'


const _cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' })
const _tajawal = Tajawal({ subsets: ['arabic', 'latin'], weight: ['400', '500', '700', '800'], variable: '--font-tajawal' })

export const metadata: Metadata = {
  title: 'Physical-thearpy-clinic',
  description: 'Experience high-end physical therapy tailored to your recovery journey. Advanced technology combined with personalized care for athletes and individuals seeking excellence.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <body 
        suppressHydrationWarning={true} 
        /* لاحظي المسافة المضافة قبل font-sans 👇 */
        className={`${_cairo.variable} ${_tajawal.variable} font-sans antialiased`}
      >  
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}

