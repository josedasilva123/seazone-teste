import {
  MdWifi,
  MdTv,
  MdAcUnit,
  MdKitchen,
  MdLocalLaundryService,
  MdElevator,
  MdBalcony,
  MdOutdoorGrill,
  MdCountertops,
  MdHotTub,
  MdPool,
} from 'react-icons/md';

export type AmenityKey =
  | 'wifi'
  | 'tv'
  | 'airConditioning'
  | 'kitchen'
  | 'washingMachine'
  | 'elevator'
  | 'balcony'
  | 'bbqGrill'
  | 'dishwasher'
  | 'jacuzzi'
  | 'pool';

interface AmenityIconProps {
  amenity: AmenityKey;
  size?: number;
  className?: string;
}

const amenityIconMap: Record<AmenityKey, React.ComponentType<{ size?: number; className?: string }>> = {
  wifi: MdWifi,
  tv: MdTv,
  airConditioning: MdAcUnit,
  kitchen: MdKitchen,
  washingMachine: MdLocalLaundryService,
  elevator: MdElevator,
  balcony: MdBalcony,
  bbqGrill: MdOutdoorGrill,
  dishwasher: MdCountertops,
  jacuzzi: MdHotTub,
  pool: MdPool,
};

export const amenityLabelMap: Record<AmenityKey, string> = {
  wifi: 'WiFi',
  tv: 'TV',
  airConditioning: 'Ar-condicionado',
  kitchen: 'Cozinha',
  washingMachine: 'Máquina de lavar',
  elevator: 'Elevador',
  balcony: 'Sacada',
  bbqGrill: 'Churrasqueira',
  dishwasher: 'Lava-louças',
  jacuzzi: 'Jacuzzi',
  pool: 'Piscina',
};

export function AmenityIcon({ amenity, size = 20, className = '' }: AmenityIconProps) {
  const Icon = amenityIconMap[amenity];
  return <Icon size={size} className={className} />;
}
