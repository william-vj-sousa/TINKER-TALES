'use client';

import { useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  min = 3,
  max = 18,
  step = 1,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-content w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="text-sm text-center m-2 text-gray-700">{value}</div>
    </div>
  );
};

export default Slider;
