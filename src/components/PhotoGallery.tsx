import { X, Download, Trash2 } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  onClose: () => void;
  onDelete: (index: number) => void;
}

export function PhotoGallery({ photos, onClose, onDelete }: PhotoGalleryProps) {
  const downloadPhoto = (photo: string, index: number) => {
    const link = document.createElement('a');
    link.href = photo;
    link.download = `cutie-booth-${index + 1}.png`;
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 border-2 md:border-4 border-rose-200">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-rose-900">Your Photos</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-rose-100 transition-colors"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-rose-700" />
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <p className="text-rose-400 text-sm md:text-base">No photos yet! Start capturing some cute moments ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-[500px] md:max-h-[600px] overflow-y-auto">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-rose-100 shadow-lg">
                <img 
                  src={photo} 
                  alt={`Captured ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl md:rounded-2xl flex items-end justify-center gap-2 p-2 md:p-4">
                <button
                  onClick={() => downloadPhoto(photo, index)}
                  className="p-2 md:p-3 bg-white rounded-full hover:bg-rose-100 transition-colors shadow-lg"
                  title="Download"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5 text-rose-700" />
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="p-2 md:p-3 bg-white rounded-full hover:bg-red-100 transition-colors shadow-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
