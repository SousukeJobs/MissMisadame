'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import QuoteDisplay from '@/components/QuoteDisplay';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <nav className="nav">
            <div className="container nav-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="nav-title">ミスミサダメ</div>
                <QuoteDisplay />
              </div>
            </div>
          </nav>
          <main className="container" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
