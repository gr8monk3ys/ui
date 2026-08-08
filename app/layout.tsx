import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { fontVariables } from "@/registry/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI — identity registry",
  description: "The lscaturchio identity as a reusable shadcn registry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
