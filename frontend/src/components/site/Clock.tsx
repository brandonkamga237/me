"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Douala",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** The time in Yaoundé, ticking. Rendered after mount: the server cannot know the visitor's now. */
export function Clock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className={`tabular-nums ${className}`} suppressHydrationWarning>
      {now ?? "--:--:--"} <span className="opacity-60">GMT+1</span>
    </time>
  );
}
