import type { CSSProperties, ReactNode } from "react";

type Tone = "light" | "dark" | "gold";

interface StickerProps {
  children: ReactNode;
  tone?: Tone;
  /** Degrees; the tilt of a sticker slapped on by hand. */
  tilt?: number;
  className?: string;
  style?: CSSProperties;
}

const tones: Record<Tone, string> = {
  light: "bg-white text-black",
  dark: "bg-black text-white",
  gold: "bg-accent text-black",
};

/**
 * A die-cut sticker, the kind handed out at tech events: thick white outline, a drop shadow,
 * a slight tilt. Draggable when it sits inside <Stickers>.
 */
export function Sticker({ children, tone = "light", tilt = 0, className = "", style }: StickerProps) {
  return (
    <span
      data-sticker
      data-cursor
      style={{ rotate: `${tilt}deg`, ...style }}
      className={`inline-flex cursor-grab touch-none select-none items-center gap-2 whitespace-nowrap rounded-full border-[3px] border-white px-3 py-1.5 text-xs font-semibold md:px-4 md:py-2 tracking-[-0.01em] shadow-[0_14px_30px_-12px_rgba(0,0,0,0.75)] ring-1 ring-black/10 active:cursor-grabbing sm:text-sm md:text-base ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
