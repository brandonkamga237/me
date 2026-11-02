import * as icons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

interface BrandIconProps {
  slug: string;
  className?: string;
}

const bySlug = new Map<string, SimpleIcon>(
  Object.values(icons as Record<string, SimpleIcon>).map((icon) => [icon.slug, icon]),
);

/** A brand's official logo from Simple Icons, in its own colour unless that would vanish on the background. */
export function BrandIcon({ slug, className = "size-4" }: BrandIconProps) {
  const icon = bySlug.get(slug);
  if (!icon) return null;
  const tooDark = luminance(icon.hex) < 0.18;
  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      className={`${className} shrink-0 ${tooDark ? "fill-fg" : ""}`}
      fill={tooDark ? undefined : `#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  );
}

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
