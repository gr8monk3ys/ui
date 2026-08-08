import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI — identity registry",
  description: "The lscaturchio identity as a reusable shadcn registry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
