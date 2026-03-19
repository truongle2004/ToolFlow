export interface WheelItem {
  id: string;
  name: string;
  color: string;
}

export interface WheelState {
  items: WheelItem[];
  isSpinning: boolean;
  rotation: number;
  winner: WheelItem | null;
}

export interface WheelConfig {
  spinDuration: number;
  minSpins: number;
}
