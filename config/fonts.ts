import { Inter as FontInter } from "next/font/google";

// Only Inter is actually used in the app (applied via fontInter.variable in layout.tsx).
// fontSans (duplicate Inter) and fontMono (Fira Code) have been removed to avoid
// redundant Google Fonts requests and unused CSS variables.
export const fontInter = FontInter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Use swap so text is visible immediately with a system font fallback
});
