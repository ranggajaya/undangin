import React from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-cream">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta">
            <span className="font-heading text-lg text-cream">U</span>
          </div>
          <h1 className="font-heading text-2xl text-ink">{title}</h1>
          <p className="mt-1 text-sm text-ink/60">{description}</p>
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </div>
    </main>
  );
}
