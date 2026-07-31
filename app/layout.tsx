import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { getContent, getSearchIndex } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AlertBanner } from "@/components/AlertBanner";
import { getSiteUrl } from "@/lib/site-url";

const content = getContent();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: content.site.portalTitle,
    template: `%s | ${content.site.shortName}`
  },
  description: content.site.description,
  applicationName: content.site.portalTitle,
  icons: { icon: content.site.favicon, apple: content.site.favicon },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "ms_MY",
    title: content.site.portalTitle,
    description: content.site.description,
    siteName: content.site.shortName
  }
};

export const viewport: Viewport = {
  themeColor: content.site.primaryColor,
  colorScheme: "light dark"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const style = {
    "--primary": content.site.primaryColor,
    "--accent": content.site.accentColor
  } as CSSProperties;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: content.site.name,
    url: content.site.officialDomain,
    email: content.site.contactEmail,
    telephone: content.site.contactPhone,
    address: content.site.address
  };

  return (
    <html lang="ms" style={style} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header content={content} searchItems={getSearchIndex(content)} />
        <AlertBanner emergency={content.site.emergency} />
        <main id="main-content">{children}</main>
        <Footer content={content} />
      </body>
    </html>
  );
}
