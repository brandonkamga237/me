import type { StaticImageData } from "next/image";
import gehmitDesktop from "@/assets/projects/gehmit-platform-desktop.webp";
import gehmitMobile from "@/assets/projects/gehmit-platform-mobile.webp";
import lescracksDesktop from "@/assets/projects/lescracks-desktop.webp";
import lescracksMobile from "@/assets/projects/lescracks-mobile.webp";
import sourcefolioDesktop from "@/assets/projects/sourcefolio-desktop.webp";
import sourcefolioMobile from "@/assets/projects/sourcefolio-mobile.webp";

export interface ProjectShots {
  desktop: StaticImageData;
  mobile?: StaticImageData;
  /** The address shown in the browser frame. */
  host: string;
}

/** Real screenshots of the live sites, by project slug. A cover set in the admin takes precedence. */
export const projectShots: Record<string, ProjectShots> = {
  lescracks: { desktop: lescracksDesktop, mobile: lescracksMobile, host: "lescracks.com" },
  sourcefolio: { desktop: sourcefolioDesktop, mobile: sourcefolioMobile, host: "sourcefolio.lescracks.com" },
  "gehmit-platform": { desktop: gehmitDesktop, mobile: gehmitMobile, host: "gehmit.org" },
};
