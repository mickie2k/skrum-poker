import type { Metadata } from 'next';
import { Archivo, Archivo_Black, Archivo_Narrow, Bowlby_One } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-sans',
});

const bowlbyOne = Bowlby_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-number',
});

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Sprint Poker | Agile Planning Made Easy',
  description: 'Vote and estimate issues in real-time with your agile team.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={` ${bowlbyOne.variable} ${archivo.variable} ${archivoBlack.variable} ${archivoNarrow.variable}`}>
      <body className="font-sans antialiased text-gray-200 bg-[#0a0a0a] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
