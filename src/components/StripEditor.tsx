import { useState, useRef, useEffect } from 'react';
import { Download, X, Heart, Star, Smile, Sparkles, Circle } from 'lucide-react';

interface Sticker {
  id: string;
  type: 'heart' | 'star' | 'smile' | 'sparkle' | 'circle';
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface StripEditorProps {
  photos: string[];
  onSave: (stripImage: string) => void;
  onCancel: () => void;
}

const stickerIcons = {
  heart: Heart,
  star: Star,
  smile: Smile,
  sparkle: Sparkles,
  circle: Circle,
};

export function StripEditor({ photos, onSave, onCancel }: StripEditorProps) {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addSticker = (type: Sticker['type']) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      type,
      x: 50,
      y: 30,
      rotation: 0,
      scale: 1,
    };
    setStickers([...stickers, newSticker]);
    setSelectedSticker(newSticker.id);
  };

  const deleteSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id));
    setSelectedSticker(null);
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers(stickers.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const downloadStrip = async () => {
    if (!stripRef.current || !canvasRef.current) return;

    const strip = stripRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const stripWidth = 400;
    const stripHeight = 1200;
    canvas.width = stripWidth;
    canvas.height = stripHeight;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, stripHeight);
    gradient.addColorStop(0, '#fff1f2');
    gradient.addColorStop(0.5, '#fce7f3');
    gradient.addColorStop(1, '#fae8ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Border decoration
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, stripWidth - 8, stripHeight - 8);

    // Draw photos
    const photoHeight = 350;
    const photoY = [50, 425, 800];
    
    for (let i = 0; i < 3; i++) {
      const img = new Image();
      img.src = photos[i];
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 25, photoY[i], 350, photoHeight);
          resolve(null);
        };
      });
    }

    // Draw stickers
    for (const sticker of stickers) {
      const Icon = stickerIcons[sticker.type];
      const x = (sticker.x / 100) * stripWidth;
      const y = (sticker.y / 100) * stripHeight;
      const size = 40 * sticker.scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);

      // Create a temporary SVG and draw it
      const svgString = getStickerSVG(sticker.type, size);
      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, -size / 2, -size / 2, size, size);
          URL.revokeObjectURL(url);
          resolve(null);
        };
        img.src = url;
      });

      ctx.restore();
    }

    // Convert to image and save
    const stripImage = canvas.toDataURL('image/png');
    onSave(stripImage);

    // Also trigger download
    const link = document.createElement('a');
    link.href = stripImage;
    link.download = `cutie-strip-${Date.now()}.png`;
    link.click();
  };

  const getStickerSVG = (type: string, size: number): string => {
    const colors = {
      heart: '#f43f5e',
      star: '#fbbf24',
      smile: '#fb923c',
      sparkle: '#a855f7',
      circle: '#ec4899',
    };
    const color = colors[type as keyof typeof colors];

    switch (type) {
      case 'heart':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
      case 'star':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
      case 'smile':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;
      case 'sparkle':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2"><path d="M12 3v18M3 12h18M6.34 6.34l11.32 11.32M17.66 6.34L6.34 17.66"></path></svg>`;
      case 'circle':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-rose-100 text-center">
        <h2 className="text-rose-900 mb-1 md:mb-2">Decorate Your Strip!</h2>
        <p className="text-rose-600 text-sm md:text-base">Add stickers and make it cute ✨</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Strip Preview */}
        <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border-2 border-rose-100">
          <div
            ref={stripRef}
            className="relative mx-auto bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50 rounded-lg overflow-hidden border-2 md:border-4 border-rose-400 shadow-xl"
            style={{ width: '200px', height: '600px' }}
          >
            {/* Photos */}
            {photos.map((photo, index) => (
              <div
                key={index}
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{
                  top: `${30 + index * 188}px`,
                  width: '170px',
                  height: '170px',
                }}
              >
                <img
                  src={photo}
                  alt={`Strip photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            ))}

            {/* Stickers */}
            {stickers.map((sticker) => {
              const Icon = stickerIcons[sticker.type];
              const isSelected = selectedSticker === sticker.id;
              
              return (
                <div
                  key={sticker.id}
                  className={`absolute cursor-move touch-none ${isSelected ? 'ring-2 md:ring-4 ring-purple-500 ring-offset-1 md:ring-offset-2' : ''}`}
                  style={{
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
                  }}
                  onClick={() => setSelectedSticker(sticker.id)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const stripRect = stripRef.current?.getBoundingClientRect();
                    if (!stripRect) return;

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const x = ((moveEvent.clientX - stripRect.left) / stripRect.width) * 100;
                      const y = ((moveEvent.clientY - stripRect.top) / stripRect.height) * 100;
                      updateSticker(sticker.id, { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  onTouchStart={(e) => {
                    const stripRect = stripRef.current?.getBoundingClientRect();
                    if (!stripRect) return;

                    const handleTouchMove = (moveEvent: TouchEvent) => {
                      const touch = moveEvent.touches[0];
                      const x = ((touch.clientX - stripRect.left) / stripRect.width) * 100;
                      const y = ((touch.clientY - stripRect.top) / stripRect.height) * 100;
                      updateSticker(sticker.id, { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
                    };

                    const handleTouchEnd = () => {
                      document.removeEventListener('touchmove', handleTouchMove);
                      document.removeEventListener('touchend', handleTouchEnd);
                    };

                    document.addEventListener('touchmove', handleTouchMove);
                    document.addEventListener('touchend', handleTouchEnd);
                  }}
                >
                  <Icon
                    className={`w-6 h-6 md:w-10 md:h-10 ${
                      sticker.type === 'heart' ? 'text-rose-500 fill-rose-500' :
                      sticker.type === 'star' ? 'text-yellow-400 fill-yellow-400' :
                      sticker.type === 'smile' ? 'text-orange-400' :
                      sticker.type === 'sparkle' ? 'text-purple-500 fill-purple-500' :
                      'text-pink-500 fill-pink-500'
                    } drop-shadow-lg`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticker Controls */}
        <div className="space-y-3 md:space-y-4">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-rose-100">
            <h3 className="text-rose-900 mb-3 md:mb-4 text-sm md:text-base">Add Stickers</h3>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <button
                onClick={() => addSticker('heart')}
                className="p-2 md:p-4 bg-rose-100 hover:bg-rose-200 rounded-xl transition-colors flex flex-col items-center gap-1 md:gap-2"
              >
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-rose-500 fill-rose-500" />
                <span className="text-rose-700 text-xs md:text-sm">Heart</span>
              </button>
              <button
                onClick={() => addSticker('star')}
                className="p-2 md:p-4 bg-yellow-100 hover:bg-yellow-200 rounded-xl transition-colors flex flex-col items-center gap-1 md:gap-2"
              >
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-700 text-xs md:text-sm">Star</span>
              </button>
              <button
                onClick={() => addSticker('smile')}
                className="p-2 md:p-4 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors flex flex-col items-center gap-1 md:gap-2"
              >
                <Smile className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                <span className="text-orange-700 text-xs md:text-sm">Smile</span>
              </button>
              <button
                onClick={() => addSticker('sparkle')}
                className="p-2 md:p-4 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors flex flex-col items-center gap-1 md:gap-2"
              >
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-500 fill-purple-500" />
                <span className="text-purple-700 text-xs md:text-sm">Sparkle</span>
              </button>
              <button
                onClick={() => addSticker('circle')}
                className="p-2 md:p-4 bg-pink-100 hover:bg-pink-200 rounded-xl transition-colors flex flex-col items-center gap-1 md:gap-2"
              >
                <Circle className="w-6 h-6 md:w-8 md:h-8 text-pink-500 fill-pink-500" />
                <span className="text-pink-700 text-xs md:text-sm">Circle</span>
              </button>
            </div>
          </div>

          {selectedSticker && (
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-purple-100">
              <h3 className="text-purple-900 mb-3 md:mb-4 text-sm md:text-base">Edit Sticker</h3>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="text-purple-700 mb-2 block text-sm md:text-base">Rotation</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={stickers.find(s => s.id === selectedSticker)?.rotation || 0}
                    onChange={(e) => updateSticker(selectedSticker, { rotation: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>
                <div>
                  <label className="text-purple-700 mb-2 block text-sm md:text-base">Size</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={stickers.find(s => s.id === selectedSticker)?.scale || 1}
                    onChange={(e) => updateSticker(selectedSticker, { scale: Number(e.target.value) })}
                    className="w-full accent-purple-500"
                  />
                </div>
                <button
                  onClick={() => deleteSticker(selectedSticker)}
                  className="w-full py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm md:text-base"
                >
                  Delete Sticker
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Action Buttons */}
      <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
        <button
          onClick={downloadStrip}
          className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 md:gap-3 text-sm md:text-base"
        >
          <Download className="w-5 h-5 md:w-6 md:h-6" />
          Save Strip
        </button>
        <button
          onClick={onCancel}
          className="bg-white text-rose-700 px-4 md:px-6 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-rose-200 flex items-center gap-2 text-sm md:text-base"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
          Cancel
        </button>
      </div>
    </div>
  );
}
