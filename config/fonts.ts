import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Inter as FontInter,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontInter = FontInter({
  subsets: ["latin"],
  variable: "--font-inter",
});
