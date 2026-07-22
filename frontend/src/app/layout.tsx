import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TriviaSphere",
  description: "A 3D Web3 Trivia Game on Celo",
  other: {
    "talentapp:project_verification":
      "a0ae841c1c0cac78d2150136fc742ec18a041386bf64db172058887f9da110ae4b1c208f57f1231788d44106bd7464d97b058425470912e0f9c7939d346fa8d1",
  },
};

import PrivyProviderWrapper from "@/components/PrivyProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
      </body>
    </html>
  );
}
