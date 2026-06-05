import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Raleway as FontRaleway,
  Raleway_Dots as FontRalewayDots,
} from "next/font/google";
import { Bebas_Neue, DM_Sans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
export const fontRaleway = FontRaleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});
export const fontRalewayDots = FontRalewayDots({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ralewayDots",
});

export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});
