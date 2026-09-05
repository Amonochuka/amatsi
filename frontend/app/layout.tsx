import type { Metadata } from 'next';
import { Fraunces, Public_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Amatsi',
  description: 'Smart irrigation & water management for smallholder farmers.',
};

// Matches ThemeProvider (components/theme/ThemeProvider.tsx): "theme" in
// localStorage, defaulting to "auto" (follow the OS). Must run before first
// paint so the dark palette is applied without a flash.
const themeBootstrapScript = `(function(){try{var t=localStorage.getItem("theme");var dark=t==="dark"||((!t||t==="auto")&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",dark?"dark":"light");if(dark)document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${fraunces.variable} ${publicSans.variable}`}>
      <head>
        <script
          type="text/javascript"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}