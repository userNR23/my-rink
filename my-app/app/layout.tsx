import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import { headers } from "next/headers";
import FirebaseAnalytics from "./components/FirebaseAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: '윤혜린 프로필',
    description: '광운대학교 전자통신공학과 4학년 윤혜린의 프로필입니다.',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
