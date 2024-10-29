import React from 'react';
import { Sliders } from 'lucide-react';

interface Props {
  brightness: number;
  setBrightness: (value: number) => void;
  blur: number;
  setBlur: (value: number) => void;
}

export default function ImageControls({ brightness, setBrightness, blur, setBlur }: Props) {
  return (
    <div className="w-full md:w-auto bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-2 text-gray-700">
        <Sliders className="h-4 w-4" />
        <h3 className="font-medium">छवि प्रभाव</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            चमक ({brightness}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            धुंधलापन ({blur}px)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="mt-1 block w-full"
          />
        </div>
      </div>
    </div>
  );
}