import { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Heart, Download, RotateCcw, Grid3x3 } from 'lucide-react';
import { PhotoGallery } from './components/PhotoGallery';
import { PhotoFrame } from './components/PhotoFrame';
import { StripMode } from './components/StripMode';
import { StripEditor } from './components/StripEditor';

type View = 'camera' | 'gallery' | 'strip-mode' | 'strip-editor';

export default function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [photoStrips, setPhotoStrips] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<View>('camera');
  const [selectedFrame, setSelectedFrame] = useState<'none' | 'hearts' | 'sparkles'>('none');
  const [stripPhotos, setStripPhotos] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const capturePhoto = () => {
  if (!videoRef.current) return;

  const canvas = canvasRef.current ?? document.createElement('canvas');
  const video = videoRef.current;

  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) {
    console.warn('Video not ready for capture yet');
    return;
  }

  canvas.width = vw;
  canvas.height = vh;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();

  ctx.translate(vw, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, vw, vh);
  ctx.restore();

  if (selectedFrame && selectedFrame !== 'none') {
    const overlay = new Image();
    overlay.crossOrigin = 'anonymous';
    const framePath = selectedFrame === 'hearts' ? '/src/assets/frame_hearts.png' : '/src/assets/frame_sparkles.png';
    overlay.onload = () => {
      ctx.drawImage(overlay, 0, 0, vw, vh);
      const photoData = canvas.toDataURL('image/png');
      setCapturedPhotos(prev => [photoData, ...prev]);
    };
    overlay.onerror = () => {
      const photoData = canvas.toDataURL('image/png');
      setCapturedPhotos(prev => [photoData, ...prev]);
    };
    overlay.src = framePath;
  } else {
    const photoData = canvas.toDataURL('image/png');
    setCapturedPhotos(prev => [photoData, ...prev]);
  }
};


  const switchCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    await startCamera();
  };

  const startStripMode = () => {
    setStripPhotos([]);
    setCurrentView('strip-mode');
  };

  const handleStripComplete = (photos: string[]) => {
    setStripPhotos(photos);
    setCurrentView('strip-editor');
  };

  const handleStripSave = (stripImage: string) => {
    setPhotoStrips(prev => [stripImage, ...prev]);
    setCapturedPhotos(prev => [stripImage, ...prev]);
    setCurrentView('camera');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-rose-600 fill-rose-600" />
            <h1 className="text-rose-900">Cutie Booth</h1>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-600 fill-purple-600" />
          </div>
          <p className="text-rose-700 text-sm md:text-base">Capture your sweetest moments ✨</p>
        </div>

        {/* Main Content */}
        {currentView === 'camera' && (
          <div className="space-y-6">
            {/* Camera View */}
            <div className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 md:border-4 border-rose-200 max-w-xs sm:max-w-sm mx-auto">
              <PhotoFrame frame={selectedFrame}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto transform scale-x-[-1]"
                  style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                />
              </PhotoFrame>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Frame Selection */}
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border-2 border-rose-100">
              <p className="text-rose-900 mb-2 md:mb-3 text-center text-sm md:text-base">Choose a frame:</p>
              <div className="flex gap-2 md:gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setSelectedFrame('none')}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full transition-all text-sm md:text-base ${
                    selectedFrame === 'none'
                      ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  None
                </button>
                <button
                  onClick={() => setSelectedFrame('hearts')}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                    selectedFrame === 'hearts'
                      ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  <Heart className="w-3 h-3 md:w-4 md:h-4" />
                  Hearts
                </button>
                <button
                  onClick={() => setSelectedFrame('sparkles')}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                    selectedFrame === 'sparkles'
                      ? 'bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  Sparkles
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
              <button
                onClick={capturePhoto}
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-4 md:px-8 py-3 md:py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 md:gap-3 text-sm md:text-base"
              >
                <Camera className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">Take Photo</span>
                <span className="sm:hidden">Photo</span>
              </button>
              <button
                onClick={startStripMode}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-8 py-3 md:py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 md:gap-3 text-sm md:text-base"
              >
                <Grid3x3 className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden sm:inline">Photo Strip</span>
                <span className="sm:hidden">Strip</span>
              </button>
              <button
                onClick={switchCamera}
                className="bg-white text-rose-700 px-4 md:px-6 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-rose-200 flex items-center gap-2 text-sm md:text-base"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Switch</span>
              </button>
              <button
                onClick={() => setCurrentView('gallery')}
                className="bg-white text-purple-700 px-4 md:px-6 py-3 md:py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-purple-200 flex items-center gap-2 text-sm md:text-base"
              >
                <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Gallery ({capturedPhotos.length})</span>
                <span className="sm:hidden">({capturedPhotos.length})</span>
              </button>
            </div>
          </div>
        )}

        {currentView === 'gallery' && (
          <PhotoGallery 
            photos={capturedPhotos} 
            onClose={() => setCurrentView('camera')}
            onDelete={(index) => {
              setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
            }}
          />
        )}

        {currentView === 'strip-mode' && (
          <StripMode
            videoRef={videoRef}
            canvasRef={canvasRef}
            onComplete={handleStripComplete}
            onCancel={() => setCurrentView('camera')}
          />
        )}

        {currentView === 'strip-editor' && (
          <StripEditor
            photos={stripPhotos}
            onSave={handleStripSave}
            onCancel={() => setCurrentView('camera')}
          />
        )}

        {/* Decorative Elements */}
        <div className="hidden md:block fixed top-10 left-10 opacity-20 pointer-events-none">
          <Heart className="w-16 h-16 text-rose-400 fill-rose-400 animate-pulse" />
        </div>
        <div className="hidden md:block fixed bottom-10 right-10 opacity-20 pointer-events-none">
          <Sparkles className="w-20 h-20 text-purple-400 fill-purple-400 animate-pulse" />
        </div>
        <div className="hidden md:block fixed top-1/4 right-20 opacity-20 pointer-events-none">
          <Heart className="w-12 h-12 text-pink-400 fill-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </div>
  );
}
