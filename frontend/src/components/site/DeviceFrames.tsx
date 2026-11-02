import Image, { type StaticImageData } from "next/image";

interface BrowserFrameProps {
  src: StaticImageData;
  host: string;
  sizes: string;
  className?: string;
}

/** A screenshot in a dark browser window: traffic lights and the address of the live site. */
export function BrowserFrame({ src, host, sizes, className = "" }: BrowserFrameProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/15 bg-[#111] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-accent" />
        </span>
        <span className="mx-auto truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[0.68rem] text-white/60">{host}</span>
      </div>
      <Image src={src} alt="" sizes={sizes} placeholder="blur" draggable={false} className="block h-auto w-full" />
    </div>
  );
}

interface PhoneFrameProps {
  src: StaticImageData;
  sizes: string;
  className?: string;
}

/** A screenshot in a phone: thick black bezel, rounded corners, a notch. */
export function PhoneFrame({ src, sizes, className = "" }: PhoneFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.8rem] border-[5px] border-[#0b0b0b] bg-[#0b0b0b] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/15 ${className}`}
    >
      <span aria-hidden className="absolute left-1/2 top-1.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
      <Image src={src} alt="" sizes={sizes} placeholder="blur" draggable={false} className="block h-auto w-full rounded-[1.4rem]" />
    </div>
  );
}

interface TerminalProps {
  title: string;
  lines: { prompt?: boolean; text: string; accent?: boolean }[];
  className?: string;
}

/** A terminal window, for projects that have no interface to screenshot. */
export function TerminalFrame({ title, lines, className = "" }: TerminalProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] font-mono text-[0.78rem] leading-relaxed shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] md:text-sm ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-accent" />
        </span>
        <span className="mx-auto text-[0.68rem] text-white/50">{title}</span>
      </div>
      <pre className="overflow-hidden whitespace-pre-wrap p-5 text-white/80 md:p-7">
        {lines.map((line, i) => (
          <span key={i} className={`block ${line.accent ? "text-accent" : ""}`}>
            {line.prompt && <span className="text-accent">$ </span>}
            {line.text}
          </span>
        ))}
        <span className="inline-block h-4 w-2 animate-pulse bg-accent align-middle" />
      </pre>
    </div>
  );
}
