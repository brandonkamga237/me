interface ProjectArtProps {
  slug: string;
  index: number;
  className?: string;
}

const W = 800;
const H = 600;
const GOLD = "#d4af37";
const LINE = "rgba(255,255,255,0.16)";
const FAINT = "rgba(255,255,255,0.07)";

/**
 * A generated illustration for a project without a cover: one of four geometric compositions,
 * picked and varied by the slug, so each project keeps the same picture across renders.
 */
export function ProjectArt({ slug, index, className = "" }: ProjectArtProps) {
  const seed = hash(slug);
  const motif = (seed + index) % 4;
  const turn = (seed % 360) - 180;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className={`size-full bg-[#0a0a0a] ${className}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`grid-${slug}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={FAINT} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#grid-${slug})`} />
      {motif === 0 && <Orbits turn={turn} />}
      {motif === 1 && <Dots seed={seed} />}
      {motif === 2 && <Layers turn={turn} />}
      {motif === 3 && <Waves seed={seed} />}
      <text x="32" y={H - 32} fill="rgba(255,255,255,0.45)" fontFamily="monospace" fontSize="14" letterSpacing="3">
        PRJ.{String(index + 1).padStart(2, "0")} {"//"} {slug.toUpperCase()}
      </text>
      <path d={`M32 32h24M32 32v24M${W - 32} 32h-24M${W - 32} 32v24`} stroke={GOLD} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function Orbits({ turn }: { turn: number }) {
  return (
    <g transform={`translate(${W / 2} ${H / 2})`}>
      {[60, 120, 180, 240].map((r) => (
        <circle key={r} r={r} fill="none" stroke={LINE} />
      ))}
      <line x1={-320} x2={320} stroke={FAINT} />
      <line y1={-280} y2={280} stroke={FAINT} />
      <g transform={`rotate(${turn})`}>
        <circle cx={180} r={14} fill={GOLD} />
        <circle cx={-120} r={6} fill="#fff" />
        <path d="M0 0L180 0" stroke={GOLD} strokeDasharray="4 6" />
      </g>
      <circle r={36} fill="none" stroke={GOLD} strokeWidth="2" />
    </g>
  );
}

function Dots({ seed }: { seed: number }) {
  const dots = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 13; x++) {
      const on = (x * 7 + y * 11 + seed) % 9 === 0;
      dots.push(<circle key={`${x}-${y}`} cx={100 + x * 50} cy={100 + y * 50} r={on ? 5 : 2} fill={on ? GOLD : LINE} />);
    }
  }
  return (
    <g>
      {dots}
      <path d={`M${W - 100} ${H - 100}A300 300 0 0 0 ${W - 400} ${H - 400}`} fill="none" stroke={GOLD} strokeWidth="2" />
    </g>
  );
}

function Layers({ turn }: { turn: number }) {
  return (
    <g transform={`translate(${W / 2} ${H / 2 + 20}) skewY(-12) rotate(${turn / 12})`}>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={-180 + i * 26}
          y={-140 + i * -40}
          width={300}
          height={180}
          fill={i === 3 ? "rgba(212,175,55,0.12)" : "none"}
          stroke={i === 3 ? GOLD : LINE}
          strokeWidth={i === 3 ? 2 : 1}
        />
      ))}
    </g>
  );
}

function Waves({ seed }: { seed: number }) {
  const lines = [];
  for (let i = 0; i < 14; i++) {
    const y = 120 + i * 28;
    const amp = 18 + ((seed >> i) % 30);
    const d = Array.from({ length: 33 }, (_, k) => {
      const x = 60 + k * 21;
      const yy = y + Math.sin(k / 3 + i / 2 + seed) * amp * Math.sin((k / 32) * Math.PI);
      return `${k === 0 ? "M" : "L"}${x.toFixed(1)} ${yy.toFixed(1)}`;
    }).join("");
    lines.push(<path key={i} d={d} fill="none" stroke={i === 7 ? GOLD : LINE} strokeWidth={i === 7 ? 2 : 1} />);
  }
  return <g>{lines}</g>;
}

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
