import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../providers/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Life's Next - Personal Finance Dashboard",
  description:
    'Reduce friction in financial tracking with automated data ingestion and goal visualization',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
