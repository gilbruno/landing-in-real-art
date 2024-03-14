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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "In Real Art",
  description: "Landing page In Real Art",
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
              {children}
              <CookieConsent />
          </Providers>
        </AppWrapper>
      </body>
    </html>
  );
}
