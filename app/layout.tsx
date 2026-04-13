import type { Metadata } from "next";

import "./globals.css";
import { getSiteUrl } from "@/src/core/config/public-env";
import { BrandingRuntime } from "@/src/projects/shared/branding/components/BrandingRuntime";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "QALYAS",
  description: "QALYAS plateforme de gestion digitale",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <BrandingRuntime />
        {children}
      </body>
    </html>
  );
}