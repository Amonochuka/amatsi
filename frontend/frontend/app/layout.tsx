import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amatsi',
  description: 'Smart irrigation & water management for smallholder farmers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
