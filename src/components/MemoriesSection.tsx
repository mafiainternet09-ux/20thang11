import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Expand } from 'lucide-react';
import { CLASS_MEMORIES, MemoryPhoto } from '../data/tributeData';
import { ResilientImage } from './ResilientImage';
import { LightboxModal } from './LightboxModal';
import { soundEngine } from '../utils/soundEngine';

type FilterCategory = 'Tất cả' | MemoryPhoto['category'];
const CATEGORIES: FilterCategory[] = ['Tất cả', 'Lớp học', 'Hoạt động', 'Cùng thầy cô'];

export function MemoriesSection() {
  const [filter, setFilter] = useState<FilterCategory>('Tất cả');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = useMemo(() => {
    if (filter === 'Tất cả') return CLASS_MEMORIES;
    return CLASS_MEMORIES.filter((p) => p.category === filter);
  }, [filter]);

  const openPhoto = (index: number) => {
    soundEngine.playEffect('shutter');
    setLightboxIndex(index);
  };

  return (
    <section
      id="ky-niem"
      aria-labelledby="memories-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#EFECE5]/65 border-t border-[#DED8CC]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#B4691E]">
              02 · Góc kỷ niệm tập thể
            </p>
            <h2
              id="memories-heading"
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2421] mt-2 text-balance"
            >
              Những khung hình ở lại cùng năm tháng
            </h2>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="group"
            aria-label="Lọc ảnh kỷ niệm theo chủ đề"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#E5E0D5] rounded-xl border border-[#DED8CC] self-start"
          >
            {CATEGORIES.map((category) => {
              const active = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setFilter(category);
                    setLightboxIndex(null);
                  }}
                  aria-pressed={active}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors min-h-[40px] whitespace-nowrap ${
                    active
                      ? 'bg-[#F9F7F2] text-[#1E3D34] shadow-sm'
                      : 'text-[#5C5B55] hover:text-[#1F2421]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Bento / Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {filteredPhotos.map((photo, index) => {
            const isFeatured = index === 0 || (filter === 'Tất cả' && index === 3);
            const colClass = isFeatured
              ? 'lg:col-span-7 min-h-[280px] sm:min-h-[340px]'
              : 'lg:col-span-5 min-h-[260px] sm:min-h-[340px]';

            return (
              <motion.figure
                key={photo.id}
                layout
                initial={{ opacity: 0, y: 24, clipPath: 'inset(10% 0% 0% 0% round 16px)' }}
                whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: Math.min((index % 2) * 0.1, 0.2), ease: [0.16, 1, 0.3, 1] }}
                className={`group relative rounded-2xl overflow-hidden border border-[#DED8CC] bg-[#1F2421] ${colClass}`}
              >
                <button
                  type="button"
                  onClick={() => openPhoto(index)}
                  aria-label={`Phóng to ảnh: ${photo.title}`}
                  className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3D34]"
                >
                  <ResilientImage
                    src={photo.image}
                    alt={photo.title}
                    fallbackTitle={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                  />

                  <span className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/45 text-white backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>

                  <figcaption className="absolute bottom-0 inset-x-0 p-5 text-[#F9F7F2]">
                    <div className="flex items-center gap-2 text-xs text-[#D6CEBE] mb-1">
                      <span>{photo.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{photo.dateLabel}</span>
                    </div>
                    <h3 className="font-editorial text-xl sm:text-2xl font-semibold leading-snug">
                      {photo.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E5E0D5] mt-1 line-clamp-2">
                      {photo.caption}
                    </p>
                  </figcaption>
                </button>
              </motion.figure>
            );
          })}
        </div>
      </div>

      <LightboxModal
        photos={filteredPhotos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}
