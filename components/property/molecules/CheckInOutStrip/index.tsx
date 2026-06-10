import { CheckInOutCard } from '@/components/property/molecules/CheckInOutCard';

interface CheckInOutStripProps {
  checkInTime: string;
  checkOutTime: string;
}

export function CheckInOutStrip({ checkInTime, checkOutTime }: CheckInOutStripProps) {
  return (
    <div className="w-full bg-gradient-to-b from-brand-navy from-50% to-background to-50% py-6">
      <div className="max-w-2xl mx-auto px-4 grid grid-cols-2 gap-3">
        <CheckInOutCard type="check-in" time={checkInTime} />
        <CheckInOutCard type="check-out" time={checkOutTime} />
      </div>
    </div>
  );
}
