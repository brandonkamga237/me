import Image from "next/image";
import portrait from "@/assets/brandon-sticker.webp";

interface PhotoStickerProps {
  alt: string;
  tilt?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * The portrait as a die-cut sticker: cut out, upscaled, with its white outline baked into the
 * image. Draggable when it sits inside <Stickers>.
 */
export function PhotoSticker({ alt, tilt = -5, className = "", sizes = "20rem", priority = false }: PhotoStickerProps) {
  return (
    <figure
      data-sticker
      data-cursor
      style={{ rotate: `${tilt}deg` }}
      className={`cursor-grab touch-none select-none active:cursor-grabbing ${className}`}
    >
      <Image
        src={portrait}
        alt={alt}
        sizes={sizes}
        priority={priority}
        draggable={false}
        className="block h-auto w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.7)] transition-[scale] duration-500 ease-out-expo hover:scale-[1.03]"
      />
    </figure>
  );
}
