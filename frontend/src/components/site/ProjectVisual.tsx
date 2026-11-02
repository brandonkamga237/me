import Image from "next/image";
import { BrowserFrame, PhoneFrame, TerminalFrame } from "@/components/site/DeviceFrames";
import { ProjectArt } from "@/components/site/ProjectArt";
import { projectShots } from "@/lib/project-media";
import type { Project } from "@/services/types";

interface ProjectVisualProps {
  project: Project;
  index: number;
}

// Kross is a web server: there is nothing to screenshot, so it shows what it does.
const TERMINALS: Record<string, { title: string; lines: { prompt?: boolean; text: string; accent?: boolean }[] }> = {
  kross: {
    title: "kross — zsh",
    lines: [
      { prompt: true, text: "go run ./cmd/kross --port 8080" },
      { text: "kross listening on :8080", accent: true },
      { prompt: true, text: "curl -i localhost:8080/" },
      { text: "HTTP/1.1 200 OK" },
      { text: "Content-Type: text/html; charset=utf-8" },
      { text: "Connection: keep-alive" },
      { text: "" },
      { text: "<h1>Hello from Kross</h1>" },
    ],
  },
};

/**
 * What a project looks like: the cover set in the admin, else the live site in a browser with
 * its phone version on top, else a terminal, else a generated composition.
 */
export function ProjectVisual({ project, index }: ProjectVisualProps) {
  const shots = projectShots[project.slug];
  const terminal = TERMINALS[project.slug];

  if (project.cover_url) {
    return <Image src={project.cover_url} alt="" fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover" />;
  }
  if (!shots && !terminal) return <ProjectArt slug={project.slug} index={index} />;

  return (
    <div className="relative size-full overflow-hidden bg-[#0a0a0a]">
      <div aria-hidden className="bg-grid absolute inset-0 [--grid:rgba(255,255,255,0.05)]" />
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/4 size-[70%] rounded-full bg-accent/20 blur-3xl"
      />
      {shots ? (
        <>
          <BrowserFrame
            src={shots.desktop}
            host={shots.host}
            sizes="(min-width: 768px) 40vw, 80vw"
            className="absolute left-[7%] top-[11%] w-[84%] -rotate-2 transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:rotate-0"
          />
          {shots.mobile && (
            <PhoneFrame
              src={shots.mobile}
              sizes="(min-width: 768px) 12vw, 26vw"
              className="absolute bottom-[6%] right-[6%] w-[24%] rotate-6 transition-transform duration-700 ease-out-expo group-hover:-translate-y-4 group-hover:rotate-3"
            />
          )}
        </>
      ) : (
        terminal && (
          <TerminalFrame
            title={terminal.title}
            lines={terminal.lines}
            className="absolute left-[8%] top-1/2 w-[84%] -translate-y-1/2 -rotate-2 transition-transform duration-700 ease-out-expo group-hover:rotate-0"
          />
        )
      )}
    </div>
  );
}
