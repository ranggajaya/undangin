interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
}

export function SubmitButton({ isLoading, label, loadingLabel }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-lg bg-terracotta py-2.5 text-sm font-medium text-cream hover:bg-terracotta/90 transition-colors disabled:opacity-50"
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
