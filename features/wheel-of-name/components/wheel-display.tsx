'use client';

import { WheelItem } from '../types';

interface WheelDisplayProps {
  items: WheelItem[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
  duration?: number;
}

export function WheelDisplay({ items, rotation, isSpinning, onSpin, duration = 5000 }: WheelDisplayProps) {
  const renderSlices = () => {
    if (items.length === 0) {
      return (
        <circle cx="50" cy="50" r="50" fill="#e2e8f0" />
      );
    }
    
    if (items.length === 1) {
      return (
        <circle cx="50" cy="50" r="50" fill={items[0].color} />
      );
    }

    let currentAngle = -90; // Start at top
    const sliceAngle = 360 / items.length;

    return items.map((item, index) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      
      // Calculate SVG path for the slice
      const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      const pathData = `
        M 50 50
        L ${x1} ${y1}
        A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      // Text position logic
      const textAngle = startAngle + sliceAngle / 2;
      const textX = 50 + 35 * Math.cos((Math.PI * textAngle) / 180);
      const textY = 50 + 35 * Math.sin((Math.PI * textAngle) / 180);

      currentAngle += sliceAngle;

      return (
        <g key={item.id}>
          <path d={pathData} fill={item.color} stroke="#ffffff" strokeWidth="0.5" />
          <text
            x={textX}
            y={textY}
            fill="#ffffff"
            fontSize="4"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
            alignmentBaseline="middle"
            className="drop-shadow-sm"
          >
            {item.name.length > 15 ? `${item.name.substring(0, 12)}...` : item.name}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto my-8 select-none">
      {/* Pointer at top */}
      <div className="absolute top-0 left-1/2 -ml-4 -mt-2 w-8 h-8 z-20 pointer-events-none drop-shadow-md">
        <svg viewBox="0 0 100 100" className="w-full h-full text-foreground fill-current">
          <path d="M 50 100 L 20 20 L 80 20 Z" />
        </svg>
      </div>

      {/* The Wheel */}
      <div 
        className="relative w-full h-full rounded-full border-4 border-muted-foreground/20 shadow-xl overflow-hidden cursor-pointer bg-muted"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 1)` : 'none',
        }}
        onClick={onSpin}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {renderSlices()}
        </svg>
      </div>
      
      {/* Center button */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-background border-4 border-muted-foreground/20 rounded-full shadow-lg z-10 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        onClick={onSpin}
      >
        <span className="font-bold text-sm md:text-xl uppercase tracking-wider text-foreground">
          {isSpinning ? '...' : 'Spin'}
        </span>
      </div>
    </div>
  );
}
