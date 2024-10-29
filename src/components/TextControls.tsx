import React from 'react';
import { Type } from 'lucide-react';

interface TextConfig {
  content: string;
  size: number;
  color: string;
  x: number;
  y: number;
  font: string;
  lineHeight: number;
  scale: number;
}

interface Props {
  textConfig: TextConfig;
  setTextConfig: React.Dispatch<React.SetStateAction<TextConfig>>;
}

export default function TextControls({ textConfig, setTextConfig }: Props) {
  const fonts = ['Noto Sans Devanagari', 'Poppins', 'Arial'];

  return (
    <div className="w-full md:w-auto bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-2 text-gray-700">
        <Type className="h-4 w-4" />
        <h3 className="font-medium">टेक्स्ट नियंत्रण</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">कोट टेक्स्ट</label>
          <textarea
            value={textConfig.content}
            onChange={(e) => setTextConfig(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="अपना कोट यहाँ लिखें&#10;नई लाइन के लिए एंटर दबाएं"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">फॉन्ट</label>
          <select
            value={textConfig.font}
            onChange={(e) => setTextConfig(prev => ({ ...prev, font: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">आकार</label>
          <input
            type="range"
            min="12"
            max="72"
            value={textConfig.size}
            onChange={(e) => setTextConfig(prev => ({ ...prev, size: Number(e.target.value) }))}
            className="mt-1 block w-full"
          />
          <span className="text-sm text-gray-500">{textConfig.size}px</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">लाइन स्पेसिंग</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={textConfig.lineHeight}
            onChange={(e) => setTextConfig(prev => ({ ...prev, lineHeight: Number(e.target.value) }))}
            className="mt-1 block w-full"
          />
          <span className="text-sm text-gray-500">{textConfig.lineHeight}x</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">रंग</label>
          <input
            type="color"
            value={textConfig.color}
            onChange={(e) => setTextConfig(prev => ({ ...prev, color: e.target.value }))}
            className="mt-1 block w-full h-8 rounded-md border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}