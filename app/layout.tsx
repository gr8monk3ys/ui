import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SiteFooter } from "@/components/gallery/site-footer";
import { SiteHeader } from "@/components/gallery/site-header";
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
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
