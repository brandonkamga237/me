"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Draggable, InertiaPlugin);
gsap.defaults({ ease: "expo.out", duration: 1.2 });

/** Media queries every animation is scoped to: no motion at all when people ask for less. */
export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

export { Draggable, gsap, ScrollTrigger, SplitText, useGSAP };
