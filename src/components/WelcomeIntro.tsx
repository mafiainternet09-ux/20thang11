import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { CLASS_INFO } from '../data/tributeData';

interface WelcomeIntroProps {
  onEnter: () => void;
  onSkip: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export function WelcomeIntro({
  onEnter,
  onSkip,
  isMusicPlaying,
  onToggleMusic,
}: WelcomeIntroProps) {
  return (
    <motion.section
      aria-label="Màn hình chào mừng 20/11"
      initial={{ opacity: 1, y: '0%' }}
      exit={{
        y: '-100%',
        opacity: 0.94,
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#161C1B] text-[#F9F7F2] px-6 py-8 sm:px-10 sm:py-10 overflow-y-auto shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
    >
      {/* Top quiet header row */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[#D6CEBE]">
          <BookOpen className="w-4 h-4 text-[#C97A2B]" aria-hidden="true" />
          <span className="tracking-wide">{CLASS_INFO.className}</span>
          <span aria-hidden="true">·</span>
          <span className="hidden sm:inline">{CLASS_INFO.schoolName}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={isMusicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền nhẹ nhàng'}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#EFECE5] border border-white/15 rounded-lg hover:bg-white/10 transition-colors min-h-[40px] whitespace-nowrap"
          >
            {isMusicPlaying ? (
              <Volume2 className="w-4 h-4 text-[#C97A2B]" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#D6CEBE]" aria-hidden="true" />
            )}
            <span>{isMusicPlaying ? 'Đang phát nhạc' : 'Bật nhạc nền'}</span>
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-[#D6CEBE] hover:text-white underline underline-offset-4 transition-colors min-h-[40px] whitespace-nowrap"
          >
            Bỏ qua intro
          </button>
        </div>
      </div>

      {/* Central Typographic Composition */}
      <div className="max-w-4xl w-full mx-auto my-auto py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 text-xs sm:text-sm tracking-[0.22em] uppercase text-[#C97A2B] mb-6"
        >
          <span>Ngày Nhà Giáo Việt Nam</span>
          <span aria-hidden="true">·</span>
          <span className="font-tabular">20 / 11</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="font-editorial text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-[#F9F7F2] text-balance leading-[1.06]"
        >
          {CLASS_INFO.themeTitle}
        </motion.h1>

        {/* Delicate decorative SVG floral divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 my-7"
          aria-hidden="true"
        >
          <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#C97A2B]/70" />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#C97A2B]"
          >
            <path
              d="M12 3C13.5 6.5 16.5 9.5 20 11C16.5 12.5 13.5 15.5 12 19C10.5 15.5 7.5 12.5 4 11C7.5 9.5 10.5 6.5 12 3Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#C97A2B]/70" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-editorial italic text-xl sm:text-2xl text-[#EFECE5] max-w-2xl mx-auto leading-relaxed"
        >
          {CLASS_INFO.introQuote}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base text-[#C7C1B5] max-w-xl mx-auto mt-4 leading-relaxed"
        >
          {CLASS_INFO.introSubtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={onEnter}
            className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#C97A2B] hover:bg-[#B4691E] text-[#161C1B] font-semibold text-sm sm:text-base rounded-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9F7F2] min-h-[44px] whitespace-nowrap"
          >
            <span>Bắt đầu khám phá</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </div>

      {/* Bottom archival credit */}
      <div className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9C968B]">
        <span>{CLASS_INFO.academicYears}</span>
        <span>Ấn phẩm tri ân điện tử dành riêng cho Thầy Cô</span>
      </div>
    </motion.section>
  );
}
