import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;
  const title = "Agrim Tycoon — One Week. Three Jobs. Zero Time.";
  const description =
    "Keep the community alive, teach the builders, and impress Elon before Friday.";

  return {
    title,
    description,
    icons: {
      icon: [
        {
          url: "/images/agrim-tech-overlord-logo.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      apple: "/images/agrim-tech-overlord-logo.png",
      shortcut: "/images/agrim-tech-overlord-logo.png",
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: socialImage, width: 1731, height: 909, alt: "Agrim Tycoon" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2efe8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
