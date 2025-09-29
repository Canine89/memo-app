import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "메모 앱",
  description: "간단하고 빠른 메모 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
