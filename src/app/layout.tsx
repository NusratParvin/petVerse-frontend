import "@/src/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "../lib/providers";
import { siteConfig } from "@/src/config/site";
import { fontRaleway } from "@/src/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Outfit:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={clsx("min-h-screen  antialiased", fontRaleway.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
