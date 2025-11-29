import { Heart, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface PhotoFrameProps {
  frame: 'none' | 'hearts' | 'sparkles';
  children: ReactNode;
}

export function PhotoFrame({ frame, children }: PhotoFrameProps) {
  if (frame === 'none') {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      
      {frame === 'hearts' && (
        <>
          {/* Corner Hearts */}
          <Heart className="absolute top-4 left-4 w-12 h-12 text-rose-400 fill-rose-400 drop-shadow-lg animate-pulse" />
          <Heart className="absolute top-4 right-4 w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Heart className="absolute bottom-4 left-4 w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '1s' }} />
          <Heart className="absolute bottom-4 right-4 w-12 h-12 text-rose-400 fill-rose-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Floating Hearts */}
          <Heart className="absolute top-1/4 left-12 w-8 h-8 text-rose-300 fill-rose-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Heart className="absolute top-1/3 right-12 w-6 h-6 text-pink-300 fill-pink-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.7s' }} />
          <Heart className="absolute bottom-1/3 left-16 w-7 h-7 text-rose-300 fill-rose-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '1.2s' }} />
          <Heart className="absolute bottom-1/4 right-16 w-9 h-9 text-pink-300 fill-pink-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '1.7s' }} />
        </>
      )}

      {frame === 'sparkles' && (
        <>
          {/* Corner Sparkles */}
          <Sparkles className="absolute top-4 left-4 w-12 h-12 text-purple-400 fill-purple-400 drop-shadow-lg animate-pulse" />
          <Sparkles className="absolute top-4 right-4 w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-4 left-4 w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute bottom-4 right-4 w-12 h-12 text-purple-400 fill-purple-400 drop-shadow-lg animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Floating Sparkles */}
          <Sparkles className="absolute top-1/4 left-12 w-8 h-8 text-purple-300 fill-purple-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Sparkles className="absolute top-1/3 right-12 w-6 h-6 text-pink-300 fill-pink-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.7s' }} />
          <Sparkles className="absolute bottom-1/3 left-16 w-7 h-7 text-purple-300 fill-purple-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '1.2s' }} />
          <Sparkles className="absolute bottom-1/4 right-16 w-9 h-9 text-pink-300 fill-pink-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '1.7s' }} />
          <Sparkles className="absolute top-1/2 left-8 w-10 h-10 text-purple-300 fill-purple-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.9s' }} />
          <Sparkles className="absolute top-1/2 right-8 w-10 h-10 text-pink-300 fill-pink-300 drop-shadow-lg animate-pulse" style={{ animationDelay: '1.4s' }} />
        </>
      )}
    </div>
  );
}
