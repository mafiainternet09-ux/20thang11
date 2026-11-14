import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MemoryPhoto } from '../data/tributeData';
import { ResilientImage } from './ResilientImage';
import { soundEngine } from '../utils/soundEngine';

interface LightboxModalProps {
  photos: MemoryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (newIndex: number) => void;
}

export function LightboxModal({
  photos,
  activeIndex,
  onClose,
  onChangeIndex,
}: LightboxModalProps) {
  const touchStartX = useRef<number | null>(null);

  const isOpen = activeIndex !== null && photos[activeIndex] !== undefined;
  const currentPhoto = isOpen ? photos[activeIndex] : null;

  const goPrev = () => {
    if (activeIndex === null) return;
    soundEngine.playEffect('shutter');
    onChangeIndex((activeIndex - 1 + photos.length) % photos.length);
  };

  const goNext = () => {
    if (activeIndex === null) return;
    soundEngine.playEffect('shutter');
    onChangeIndex((activeIndex + 1) % photos.length);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && activeIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Xem ảnh: ${currentPhoto.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/88 backdrop-blur-md p-4 sm:p-8"
        >
          {/* Top controls */}
          <div
            className="flex items-center justify-between text-[#F9F7F2] max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#D6CEBE]">
              <span className="font-tabular">
                {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentPhoto.category}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng trình xem ảnh"
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Stage */}
          <div
            className="relative flex-1 flex items-center justify-center max-w-5xl w-full mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={goPrev}
              aria-label="Ảnh trước"
              className="hidden sm:inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors mr-4 shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[68vh] w-full flex items-center justify-center"
            >
              <ResilientImage
                src={currentPhoto.image}
                alt={currentPhoto.title}
                fallbackTitle={currentPhoto.title}
                loading="eager"
                className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
              />
            </motion.div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Ảnh tiếp theo"
              className="hidden sm:inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-4 shrink-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption & Mobile Nav */}
          <div
            className="max-w-3xl w-full mx-auto text-center text-[#F9F7F2]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-editorial text-2xl font-semibold">{currentPhoto.title}</h3>
            <p className="text-sm text-[#D6CEBE] mt-1">{currentPhoto.caption}</p>
            <p className="text-xs text-[#9C968B] mt-1">{currentPhoto.dateLabel}</p>

            <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Ảnh trước"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-white/10 text-white text-sm min-h-[44px]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Ảnh tiếp theo"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-white/10 text-white text-sm min-h-[44px]"
              >
                <span>Sau</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
