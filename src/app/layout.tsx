import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduTrack Parent",
  description: "Parent portal for reviewing children progress, attendance, exams, and schedules.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
