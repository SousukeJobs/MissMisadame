'use client';

import { Inter } from "next/font/google";
import Image from 'next/image';
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import QuoteDisplay from '@/components/QuoteDisplay';
import Eye from '@/components/Eye';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <Script id="adobe-fonts" strategy="afterInteractive">
          {`
            (function(d) {
              var config = {
                kitId: 'erk4urv',
                scriptTimeout: 3000,
                async: true
              },
              h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
            })(document);
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <nav className="nav">
            <div className="container nav-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div className="nav-title adobe-fonts">ミスミサダメ</div>
                <Eye />
                <Eye />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
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
