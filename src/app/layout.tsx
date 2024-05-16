import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/unbounded";

import { AppWrapper } from "@/context";
import { Providers } from "./providers";
import classNames from "classnames";
import { fonts } from "./fonts";
import Menu from "@/components/menu/Menu";
import CookieConsent from "@/components/cookie/CookieConsent";
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ogImage from './opengraph-image.png'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "In Real Art",
  description: "Landing page In Real Art, RWA: Elevating Art, Empowering Change",
  icons: {
    icon: '/img/favicon-32x32.png',
    shortcut: '/img/favicon-16x16.png',
    apple: '/img/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://inrealart.com/"),
  openGraph: {
    title: 'In Real Art',
    description: 'RWA: Elevating Art, Empowering Change',
    url: 'https://inrealart.com/',
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
    type: 'website',
  },
  twitter: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics GA_MEASUREMENT_ID='G-YYDGWE6SDT'/>
      <body className={classNames(inter.className, fonts.rubik.variable)}>
        <AppWrapper>
          <Providers>
              <Menu />
              <div className="content-container">
              {children}
              </div>
              <CookieConsent />
          </Providers>
        </AppWrapper>
      </body>
    </html>
  );
}
