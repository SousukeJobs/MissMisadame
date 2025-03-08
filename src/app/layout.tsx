import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "間違い博物館",
  description: "学習のミスを追跡し、改善につなげるアプリケーション",
};

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
              <div className="nav-title">間違い博物館</div>
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
