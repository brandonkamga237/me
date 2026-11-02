import { DM_Sans, JetBrains_Mono } from "next/font/google";

// The LesCracks typefaces: DM Sans for text and display, JetBrains Mono for labels.
export const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], axes: ["opsz"] });
export const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });
