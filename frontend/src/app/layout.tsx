import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevTools Hub',
  description: 'Full-stack developer utility platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-zinc-100 antialiased flex h-screen overflow-hidden`}>
        <Sidebar />
        <main className="flex-1 h-screen overflow-hidden flex flex-col relative w-full bg-[#09090b]">
          {children}
        </main>
      </body>
    </html>
  );
}
