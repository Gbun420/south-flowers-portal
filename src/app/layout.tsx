import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css'; // Assuming globals.css exists and is where tailwind imports are

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'South Flowers C.H.R.A.',
    template: '%s | South Flowers C.H.R.A.'
  },
  description: 'Cannabis Harm Reduction Association - Premium cannabis club in Malta. Member portal for authorized access to our harm reduction services and community.',
  keywords: ['cannabis', 'harm reduction', 'malta', 'CHRA', 'south flowers', 'cannabis club', 'medical cannabis'],
  authors: [{ name: 'South Flowers C.H.R.A.' }],
  creator: 'South Flowers C.H.R.A.',
  publisher: 'South Flowers C.H.R.A.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://southflowers.mt'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_MT',
    url: '/',
    title: 'South Flowers C.H.R.A.',
    description: 'Cannabis Harm Reduction Association - Premium cannabis club in Malta',
    siteName: 'South Flowers C.H.R.A.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'South Flowers C.H.R.A.',
    description: 'Cannabis Harm Reduction Association - Premium cannabis club in Malta',
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {process.env.NODE_ENV === 'development' && (
          <Script src="http://localhost:8097" strategy="beforeInteractive" />
        )}
        {children}
      </body>
    </html>
  );
}