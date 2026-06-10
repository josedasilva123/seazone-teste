import type { ReactNode } from 'react';
import { MdAccessTime, MdEventAvailable } from 'react-icons/md';

type CheckInOutType = 'check-in' | 'check-out';

interface CheckInOutCardProps {
  type: CheckInOutType;
  time: string;
}

const config: Record<
  CheckInOutType,
  {
    title: string;
    formatTime: (time: string) => string;
    icon: ReactNode;
    iconBg: string;
    iconColor: string;
  }
> = {
  'check-in': {
    title: 'Check-in',
    formatTime: (time) => `A partir das ${time}`,
    icon: <MdEventAvailable size={24} aria-hidden />,
    iconBg: 'bg-checkin-icon-bg',
    iconColor: 'text-primary',
  },
  'check-out': {
    title: 'Check-out',
    formatTime: (time) => `Até as ${time}`,
    icon: <MdAccessTime size={24} aria-hidden />,
    iconBg: 'bg-checkout-icon-bg',
    iconColor: 'text-checkout-icon',
  },
};

export function CheckInOutCard({ type, time }: CheckInOutCardProps) {
  const { title, formatTime, icon, iconBg, iconColor } = config[type];

  return (
    <article className="bg-surface rounded-[--radius-xl] shadow-md border border-border/50 px-4 py-5 flex flex-col items-center text-center gap-3">
      <div
        className={[
          'flex items-center justify-center w-12 h-12 rounded-full shrink-0',
          iconBg,
          iconColor,
        ].join(' ')}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-text-heading leading-tight">{title}</h3>
        <p className="text-sm text-text-muted mt-1">{formatTime(time)}</p>
      </div>
    </article>
  );
}
