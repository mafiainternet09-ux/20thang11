import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { CLASS_INFO, FINALE_DATA } from '../data/tributeData';
import { ResilientImage } from './ResilientImage';
import { WishRecord } from './WishesWallSection';

interface FinaleSectionProps {
  highlightedWishes: WishRecord[];
  onBackToTop: () => void;
}

export function FinaleSection({ highlightedWishes, onBackToTop }: FinaleSectionProps) {
  const featured = highlightedWishes.slice(0, 2);

  return (
    <section
      id="ket-thuc"
      aria-labelledby="finale-heading"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#161C1B] text-[#F9F7F2]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[#C97A2B]">
            {FINALE_DATA.eyebrow}
          </p>
          <h2
            id="finale-heading"
            className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F9F7F2] mt-4 leading-[1.1] text-balance"
          >
            {FINALE_DATA.headline}
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#D6CEBE] leading-relaxed">
            {FINALE_DATA.collectiveMessage}
          </p>
        </motion.div>

        {/* Visual + Highlighted Wishes Pair */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24, clipPath: 'inset(8% 0% 0% 0% round 16px)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 rounded-2xl overflow-hidden border border-white/15 min-h-[260px]"
          >
            <ResilientImage
              src={FINALE_DATA.featuredImage}
              alt="Bó hoa cúc họa mi trên bàn giáo viên trước bảng xanh"
              fallbackTitle={CLASS_INFO.themeTitle}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {featured.length > 0 ? (
              featured.map((wish, idx) => (
                <motion.blockquote
                  key={wish.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl bg-[#1F2725] border border-white/10 p-6 flex-1 flex flex-col justify-between"
                >
                  <p className="font-editorial italic text-xl text-[#EFECE5] leading-relaxed">
                    “{wish.message}”
                  </p>
                  <footer className="mt-4 text-xs text-[#C97A2B]">— {wish.author}</footer>
                </motion.blockquote>
              ))
            ) : (
              <blockquote className="rounded-2xl bg-[#1F2725] border border-white/10 p-6 flex-1 flex flex-col justify-center">
                <p className="font-editorial italic text-2xl text-[#EFECE5] leading-relaxed">
                  “Dù đi qua bao nhiêu mùa nắng gió, lòng biết ơn dành cho thầy cô vẫn nguyên vẹn như ngày đầu tiên.”
                </p>
                <footer className="mt-4 text-xs text-[#C97A2B]">— {CLASS_INFO.className}</footer>
              </blockquote>
            )}
          </div>
        </div>

        {/* Fullscreen Closing Message & Footer */}
        <div className="mt-16 pt-12 border-t border-white/15 text-center space-y-6">
          <p className="font-editorial italic text-2xl sm:text-4xl text-[#C97A2B] text-balance">
            {FINALE_DATA.closingCalligraphy}
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onBackToTop}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/20 hover:bg-white/10 text-sm font-medium text-[#F9F7F2] transition-colors min-h-[44px]"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
              <span>Trở về đầu trang</span>
            </button>
          </div>

          <p className="text-xs text-[#9C968B] pt-4">
            {CLASS_INFO.className} · {CLASS_INFO.schoolName} · {CLASS_INFO.academicYears}
          </p>
        </div>
      </div>
    </section>
  );
}
