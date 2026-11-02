"use client";

import type { ReactNode } from "react";

interface ConfirmButtonProps {
  action: () => Promise<void>;
  confirmation: string;
  children: ReactNode;
  className?: string;
}

export function ConfirmButton({ action, confirmation, children, className = "" }: ConfirmButtonProps) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(event) => {
          if (!window.confirm(confirmation)) event.preventDefault();
        }}
        className={`text-sm text-danger hover:underline ${className}`}
      >
        {children}
      </button>
    </form>
  );
}
