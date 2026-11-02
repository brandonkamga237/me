const lines = [
  ["whoami", "brandon: engineer, founder of lescracks"],
  ["focus --now", "distributed backends · platforms · infra"],
  ["stack --core", "java · spring · go · typescript · python"],
] as const;

/** Decorative: the same terminal as the GitHub profile header, typing its lines in. */
export function Terminal() {
  return (
    <div aria-hidden className="overflow-hidden rounded-xl border border-border bg-panel font-mono text-[13px] shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-auto text-xs text-muted">~/brandonkamga</span>
      </div>
      <div className="space-y-4 p-5">
        {lines.map(([command, output], i) => (
          <div key={command}>
            <p className="type-line" style={{ animationDelay: `${0.3 + i * 1.1}s` }}>
              <span className="text-muted">$</span> {command}
            </p>
            <p className="type-line text-muted" style={{ animationDelay: `${0.8 + i * 1.1}s` }}>
              {output}
            </p>
          </div>
        ))}
        <p>
          <span className="text-muted">$</span> <span className="cursor inline-block h-4 w-2 translate-y-0.5 bg-fg" />
        </p>
      </div>
    </div>
  );
}
