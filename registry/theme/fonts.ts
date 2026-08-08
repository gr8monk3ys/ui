import { Fraunces, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";

/** Fraunces — display serif for headings and drop caps. */
export const displayFont = Fraunces({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--site-font-display",
});

/** Instrument Sans — body text. */
export const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--site-font-body",
});

/** IBM Plex Mono — wall-label metadata, kickers, catalogue numbers. */
export const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  variable: "--site-font-mono",
});

/** Put this on <html> (or <body>) className. */
export const fontVariables = `${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`;
