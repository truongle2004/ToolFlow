import { WheelItem, WheelConfig } from '../types';

export const WHEEL_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', 
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', 
  '#f43f5e'
];

export const getRandomColor = (): string => {
  return WHEEL_COLORS[Math.floor(Math.random() * WHEEL_COLORS.length)];
};

export const getColorByIndex = (index: number): string => {
  return WHEEL_COLORS[index % WHEEL_COLORS.length];
};

export const calculateSpin = (
  items: WheelItem[],
  currentRotation: number,
  config: WheelConfig
): { targetRotation: number; winner: WheelItem } => {
  if (items.length === 0) {
    throw new Error('Cannot spin an empty wheel');
  }

  const winningIndex = Math.floor(Math.random() * items.length);
  const winner = items[winningIndex];

  const arc = 360 / items.length;
  
  // Random offset inside the winning slice so it doesn't land exactly on the line
  const randomOffset = (Math.random() * (arc * 0.8)) + (arc * 0.1);
  
  const extraSpins = config.minSpins * 360;
  
  // The wheel pointer is usually at the top (270 degrees) or right (0 degrees)
  // Assuming a CSS rotate implementation where 0deg is top and rotates clockwise,
  // slice 0 starts from 0 to 'arc' angle.
  // To make slice `i` land at top, we need to bring its middle to 0deg (or 360deg).
  
  const sliceStartAngle = winningIndex * arc;
  const targetBase = 360 - sliceStartAngle - randomOffset;
  
  // Adding previous remainder so wheel continues smoothly without jumping back
  const targetRotation = currentRotation + extraSpins + (360 - (currentRotation % 360)) + targetBase;

  return { targetRotation, winner };
};
