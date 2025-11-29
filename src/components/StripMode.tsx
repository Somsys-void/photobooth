import { useState, useEffect, RefObject } from 'react';
import { Camera, X } from 'lucide-react';

interface StripModeProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onComplete: (photos: string[]) => void;
  onCancel: () => void;
}

export function StripMode({ videoRef, canvasRef, onComplete, onCancel }: StripModeProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      capturePhoto();
    }
  }, [countdown]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/png');
        const newPhotos = [...photos, photoData];
        setPhotos(newPhotos);

        if (newPhotos.length < 3) {
          // Start countdown for next photo
          setTimeout(() => setCountdown(3), 1000);
        } else {
          // All photos captured
          setTimeout(() => {
            onComplete(newPhotos);
          }, 500);
        }
      }
    }
    setCountdown(null);
  };

  const startCapture = () => {
    setCapturing(true);
    setCountdown(3);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-rose-100 text-center">
        <h2 className="text-rose-900 mb-1 md:mb-2">Photo Strip Mode</h2>
        <p className="text-rose-600 text-sm md:text-base">Take 3 photos in a row!</p>
      </div>

      {/* Camera View */}
      <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 md:border-4 border-rose-200 max-w-xs sm:max-w-sm mx-auto">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto transform scale-x-[-1]"
          style={{ aspectRatio: '3/4', objectFit: 'cover' }}
        />
        
        {/* Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-6xl md:text-9xl animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* Flash Effect */}
        {countdown === 0 && (
          <div className="absolute inset-0 bg-white animate-ping" style={{ animationDuration: '200ms', animationIterationCount: '1' }} />
        )}
      </div>

      {/* Photo Progress */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-2 border-rose-100">
        <p className="text-rose-900 mb-3 md:mb-4 text-center text-sm md:text-base">Photos captured: {photos.length}/3</p>
        <div className="flex gap-2 md:gap-4 justify-center">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-16 h-24 md:w-24 md:h-32 rounded-lg border-2 md:border-4 flex items-center justify-center ${
                photos[index]
                  ? 'border-rose-400'
                  : 'border-rose-200 border-dashed'
              }`}
            >
              {photos[index] ? (
                <img src={photos[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-rose-300 text-2xl md:text-4xl">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
        {!capturing ? (
          <>
            <button
              onClick={startCapture}
              className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 md:gap-3 text-sm md:text-base"
            >
              <Camera className="w-5 h-5 md:w-6 md:h-6" />
              Start Strip
            </button>
            <button
              onClick={onCancel}
              className="bg-white text-rose-700 px-4 md:px-6 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-rose-200 flex items-center gap-2 text-sm md:text-base"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
              Cancel
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-rose-600 text-sm md:text-base">Smile! Get ready for your photos! 📸</p>
          </div>
        )}
      </div>
    </div>
  );
}
