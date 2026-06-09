import { MdCheckCircle, MdCancel } from 'react-icons/md';

interface RuleStatusProps {
  allowed: boolean;
  label: string;
  className?: string;
}

export function RuleStatus({ allowed, label, className = '' }: RuleStatusProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {allowed ? (
        <MdCheckCircle size={18} className="text-success shrink-0" />
      ) : (
        <MdCancel size={18} className="text-danger shrink-0" />
      )}
      <span
        className={`text-sm font-medium ${allowed ? 'text-success' : 'text-danger'}`}
      >
        {label}
      </span>
    </div>
  );
}
