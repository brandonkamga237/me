export function CameroonFlag({ className = "h-3.5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 30 20" className={`rounded-[2px] ${className}`}>
      <rect width="10" height="20" fill="#007a5e" />
      <rect x="10" width="10" height="20" fill="#ce1126" />
      <rect x="20" width="10" height="20" fill="#fcd116" />
      <path fill="#fcd116" d="M15 6.2l.9 2.8h2.9l-2.4 1.7.9 2.8-2.3-1.7-2.3 1.7.9-2.8-2.4-1.7h2.9z" />
    </svg>
  );
}
