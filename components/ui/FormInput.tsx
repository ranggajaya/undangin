import React from "react";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  registration: React.InputHTMLAttributes<HTMLInputElement>;
  errorMessage?: string;
  rightElement?: React.ReactNode;
}

export function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  registration,
  errorMessage,
  rightElement,
}: FormInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-ink/70"
        >
          {label}
        </label>
        {rightElement}
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-ink/20 px-3.5 py-2 text-sm text-ink focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
        {...registration}
      />
      {errorMessage && (
        <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
