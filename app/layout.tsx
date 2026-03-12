import type { Metadata } from 'next';
import { Mulish } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import Analytics from '@/components/Analytics';
import StructuredData from '@/components/StructuredData';
import {
  HOME_PAGE_TITLE,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_SHARE_ASSET,
  SITE_URL,
  toSchemaImage,
} from '@/lib/seo';
import { createSiteGraph } from '@/lib/schema';

const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const fallbackShareImage = toSchemaImage(SITE_SHARE_ASSET);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_PAGE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['baby names', 'name generator', 'baby name meaning', 'popular names', 'unique baby names', 'boy names', 'girl names', 'name origin', 'baby name 2026'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `${SITE_NAME} - Baby Name Generator`,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{
      url: fallbackShareImage.url,
      width: fallbackShareImage.width,
      height: fallbackShareImage.height,
      alt: fallbackShareImage.caption,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Baby Name Generator`,
    description: SITE_DESCRIPTION,
    images: [{
      url: fallbackShareImage.url,
      width: fallbackShareImage.width,
      height: fallbackShareImage.height,
      alt: fallbackShareImage.caption,
    }],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SITE_LANGUAGE} className={`scroll-smooth ${mulish.variable}`}>
      <head>
        <StructuredData data={createSiteGraph()} />
      </head>
      <body className={`min-h-screen flex flex-col font-sans text-gray-900 ${mulish.className}`}>
        <Analytics />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}