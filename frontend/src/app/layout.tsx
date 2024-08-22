import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Analytics } from '@vercel/analytics/react';

import '../styles/globals.css';

import { ContextProvider } from '@/components/context-provider';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Code Sketch',
  description: 'Visualise Your GitHub Repositories In ASCII',
  openGraph: {
    title: 'Code Sketch',
    description: 'Visualise Your GitHub Repositories In ASCII',
    url: 'https://code-sketch.vercel.app',
    siteName: 'Code Sketch',
    locale: 'en_US',
    type: 'website',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <main className="w-full">
            <div className="p-4 mt-10 flex w-full flex-col space-y-6 items-center justify-center text-start">
              <div className="max-w-5xl flex w-full flex-col">
                <Header />
                {children}
                <Analytics />
              </div>
            </div>
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
