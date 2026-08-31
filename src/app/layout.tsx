import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media",
  description: "Minimal Media Browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen selection:bg-zinc-800 selection:text-zinc-200">
        {children}
      </body>
    </html>
  );
}
