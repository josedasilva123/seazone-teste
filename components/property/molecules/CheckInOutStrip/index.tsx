import type { ReactNode } from 'react';
import { MdLogin, MdLogout } from 'react-icons/md';

interface CheckInOutStripProps {
  checkInTime: string;
  checkOutTime: string;
}

function StripItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
          {label}
        </p>
        <p className="text-sm font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

export function CheckInOutStrip({ checkInTime, checkOutTime }: CheckInOutStripProps) {
  return (
    <div className="w-full bg-primary text-white">
      <div className="max-w-2xl mx-auto px-4 py-4 grid grid-cols-2 divide-x divide-white/20">
        <div className="pr-4">
          <StripItem
            icon={<MdLogin size={18} />}
            label="Check-in"
            value={`A partir das ${checkInTime}`}
          />
        </div>
        <div className="pl-4">
          <StripItem
            icon={<MdLogout size={18} />}
            label="Check-out"
            value={`Até as ${checkOutTime}`}
          />
        </div>
      </div>
    </div>
  );
}
