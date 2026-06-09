interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = '' }: DividerProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-subtle font-medium uppercase tracking-wider">
          {label}
        </span>
        <span className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return <hr className={`border-none h-px bg-border ${className}`} />;
}
