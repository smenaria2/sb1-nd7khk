import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';
import TextControls from './TextControls';
import ImageControls from './ImageControls';
import AuthorControls from './AuthorControls';

const FOOTER_HEIGHT = 120; // Increased footer height for larger watermark
const CONTROLS_MARGIN = 120; // Added margin for mobile scrolling

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

interface AuthorConfig {
  name: string;
  image: string | null;
  show: boolean;
}

export default function ImageEditor() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [textConfig, setTextConfig] = useState<TextConfig>({
    content: 'अपना कोट यहाँ लिखें\nनई लाइन के लिए एंटर दबाएं',
    size: 32,
    color: '#ffffff',
    x: 50,
    y: 50,
    font: 'Noto Sans Devanagari',
    lineHeight: 1.5,
    scale: 1
  });
  const [authorConfig, setAuthorConfig] = useState<AuthorConfig>({
    name: '',
    image: null,
    show: false
  });
  const [brightness, setBrightness] = useState(100);
  const [blur, setBlur] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [lastDistance, setLastDistance] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image with brightness
    ctx.filter = `brightness(${brightness}%) blur(${blur}px)`;
    ctx.drawImage(image, 0, 0);
    ctx.filter = 'none';

    // Calculate text boundaries
    const textBoundary = {
      top: 20,
      bottom: canvas.height - FOOTER_HEIGHT,
      left: 20,
      right: canvas.width - 20
    };

    // Ensure text position stays within boundaries
    const boundedX = Math.min(Math.max(textConfig.x, textBoundary.left), textBoundary.right);
    const boundedY = Math.min(Math.max(textConfig.y, textBoundary.top), textBoundary.bottom);

    // Draw text
    ctx.save();
    ctx.font = `${textConfig.size * scale}px ${textConfig.font}`;
    ctx.fillStyle = textConfig.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = textConfig.content.split('\n');
    const lineHeight = textConfig.size * scale * textConfig.lineHeight;
    
    lines.forEach((line, index) => {
      const y = boundedY + (index - (lines.length - 1) / 2) * lineHeight;
      if (y >= textBoundary.top && y <= textBoundary.bottom) {
        ctx.fillText(line, boundedX, y);
      }
    });
    ctx.restore();

    // Draw footer background
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, canvas.height - FOOTER_HEIGHT, canvas.width, FOOTER_HEIGHT);
    ctx.restore();

    // Draw footer columns
    const footerY = canvas.height - FOOTER_HEIGHT/2;
    
    // First column (40%) - Watermark logo (increased size)
    const watermarkWidth = canvas.width * 0.4;
    const watermarkImg = new Image();
    watermarkImg.onload = () => {
      const aspectRatio = watermarkImg.height / watermarkImg.width;
      const logoHeight = Math.min(FOOTER_HEIGHT * 0.9, watermarkWidth * aspectRatio);
      const logoWidth = logoHeight / aspectRatio;
      ctx.drawImage(
        watermarkImg,
        20,
        footerY - logoHeight/2,
        logoWidth,
        logoHeight
      );
    };
    watermarkImg.src = '/navsrijan-logo.png';

    // Last two columns (20% + 30%) - Author section
    if (authorConfig.show && authorConfig.name) {
      const authorSectionStart = canvas.width * 0.5;
      const profilePicSection = canvas.width * 0.2;
      const nameSection = canvas.width * 0.3;

      // Draw author image if available
      if (authorConfig.image) {
        const size = FOOTER_HEIGHT * 0.6;
        const authorImg = new Image();
        authorImg.onload = () => {
          const x = authorSectionStart + (profilePicSection - size) / 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + size/2, footerY, size/2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(authorImg, x, footerY - size/2, size, size);
          ctx.restore();
        };
        authorImg.src = authorConfig.image;
      }

      // Draw author name in last column
      ctx.save();
      ctx.font = '24px Noto Sans Devanagari';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const nameX = authorSectionStart + profilePicSection + nameSection/2;
      ctx.fillText(authorConfig.name, nameX, footerY);
      ctx.restore();
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Convert coordinates to canvas scale
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    setIsDragging(true);
    setDragStart({ x: x - textConfig.x, y: y - textConfig.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Convert coordinates to canvas scale
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    setTextConfig(prev => ({
      ...prev,
      x: x - dragStart.x,
      y: y - dragStart.y
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastDistance(distance);
    } else {
      handleMouseDown(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = distance - lastDistance;
      setScale(prev => Math.max(0.5, Math.min(2, prev + delta * 0.01)));
      setLastDistance(distance);
    } else {
      handleMouseMove(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'quote-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    drawCanvas();
  }, [image, textConfig, brightness, blur, authorConfig, scale]);

  return (
    <div className="space-y-6">
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex flex-col items-center space-y-2"
          >
            <Upload className="h-12 w-12 text-gray-400" />
            <span className="text-sm text-gray-600">छवि अपलोड करें</span>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <TextControls
              textConfig={textConfig}
              setTextConfig={setTextConfig}
            />
            <ImageControls
              brightness={brightness}
              setBrightness={setBrightness}
              blur={blur}
              setBlur={setBlur}
            />
            <AuthorControls
              authorConfig={authorConfig}
              setAuthorConfig={setAuthorConfig}
            />
          </div>
          
          <div className="relative border rounded-lg overflow-hidden bg-gray-800 flex justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="max-w-full h-auto cursor-move touch-none"
            />
          </div>

          <div className="flex justify-end space-x-4 mb-32">
            <button
              onClick={() => {
                const input = document.getElementById('image-upload') as HTMLInputElement;
                if (input) input.click();
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
            >
              <ImageIcon className="h-4 w-4" />
              <span>छवि बदलें</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>डाउनलोड करें</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}