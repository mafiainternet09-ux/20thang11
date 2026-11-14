import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Volume2, VolumeX } from 'lucide-react';
import { CLASS_INFO } from '../data/tributeData';
import { getTeachersDayCountdown, TeachersDayCountdown } from '../utils/countdown';
import { ResilientImage } from './ResilientImage';

interface HeroCountdownSectionProps {
  onExploreTeachers: () => void;
  onExploreHomeroom: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export function HeroCountdownSection({
  onExploreTeachers,
  onExploreHomeroom,
  isMusicPlaying,
  onToggleMusic,
}: HeroCountdownSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);

  const [countdown, setCountdown] = useState<TeachersDayCountdown>(() =>
    getTeachersDayCountdown(new Date())
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getTeachersDayCountdown(new Date()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const pad = (val: number) => String(val).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      id="trang-chu"
      aria-labelledby="hero-heading"
      className="relative pt-10 pb-16 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8 scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Split Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Typographic Column */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between py-2"
          >
            <div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[#5C5B55] mb-5">
                <span className="font-medium text-[#1E3D34]">{CLASS_INFO.className}</span>
                <span aria-hidden="true">·</span>
                <span>{CLASS_INFO.schoolName}</span>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <span className="w-full sm:w-auto">{CLASS_INFO.academicYears}</span>
              </div>

              <h1
                id="hero-heading"
                className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1F2421] leading-[1.08] text-balance"
              >
                Tri ân Ngày Nhà Giáo Việt Nam 20/11
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[#4A4943] leading-relaxed max-w-xl">
                {CLASS_INFO.heroLead}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onExploreTeachers}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3D34] hover:bg-[#162E27] text-[#F9F7F2] text-sm font-semibold rounded-lg transition-colors min-h-[44px] whitespace-nowrap"
              >
                <span>Khám phá góc tri ân</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onExploreHomeroom}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#EFECE5] hover:bg-[#E4DFD4] text-[#1F2421] text-sm font-medium rounded-lg border border-[#DED8CC] transition-colors min-h-[44px] whitespace-nowrap"
              >
                <span>Thư gửi cô chủ nhiệm</span>
              </button>

              <button
                type="button"
                onClick={onToggleMusic}
                aria-pressed={isMusicPlaying}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#5C5B55] hover:text-[#1F2421] rounded-lg border border-[#DED8CC] hover:bg-[#EFECE5]/60 transition-colors min-h-[44px] whitespace-nowrap"
              >
                {isMusicPlaying ? (
                  <Volume2 className="w-4 h-4 text-[#B4691E]" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{isMusicPlaying ? 'Tắt nhạc' : 'Nghe nhạc nền'}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Editorial Photography Anchor with Scroll Parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col"
          >
            <figure className="relative flex-1 min-h-[300px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-[#DED8CC] bg-[#EFECE5] shadow-sm">
              <motion.div
                style={{ y: heroImageY, scale: heroImageScale }}
                className="w-full h-full will-change-transform"
              >
                <ResilientImage
                  src={CLASS_INFO.heroImage}
                  alt="Phòng học ngập tràn nắng chiều, bảng xanh và bàn gỗ kỷ niệm"
                  fallbackTitle={CLASS_INFO.themeTitle}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
              />
              <figcaption className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-4 text-xs text-[#F9F7F2]">
                <span className="font-editorial italic text-sm sm:text-base">
                  “{CLASS_INFO.themeTitle}” — Ấn phẩm kỷ niệm 20/11
                </span>
                <span className="font-tabular opacity-85 shrink-0">12C3</span>
              </figcaption>
            </figure>
          </motion.div>
        </div>

        {/* Full-Width Live Countdown Strip (Asia/Ho_Chi_Minh) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 rounded-2xl bg-[#EFECE5] border border-[#DED8CC] px-6 py-6 sm:px-8 sm:py-7"
          data-testid="countdown-panel"
        >
          {countdown.status === 'today' ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-[#B4691E]">
                  Hôm nay là Ngày Nhà giáo Việt Nam · {countdown.formattedDateLabel}
                </p>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F2421] mt-1">
                  Chúc mừng Ngày Nhà giáo Việt Nam 20/11!
                </h2>
              </div>
              <p className="text-sm text-[#4A4943] max-w-md">
                Kính chúc quý thầy cô một ngày lễ thật rạng rỡ, ấm áp nghĩa tình và ngập tràn hoa tươi từ những thế hệ học trò.
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-[#1E3D34]">
                  Đếm ngược đến ngày tri ân · Múi giờ Việt Nam (UTC+7)
                </p>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#1F2421] mt-1">
                  Hướng về ngày {countdown.formattedDateLabel}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5B55] mt-1">
                  {countdown.status === 'after'
                    ? `Đã qua 20/11/${countdown.currentYearInVN} — Tiếp tục đếm ngược tới mùa tri ân ${countdown.targetYear}.`
                    : `Từng ngày trôi qua là thêm một khoảnh khắc đáng nhớ bên mái trường.`}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Ngày', value: pad(countdown.days) },
                  { label: 'Giờ', value: pad(countdown.hours) },
                  { label: 'Phút', value: pad(countdown.minutes) },
                  { label: 'Giây', value: pad(countdown.seconds) },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="bg-[#F9F7F2] border border-[#DED8CC] rounded-xl px-3 py-3 sm:px-5 sm:py-4 text-center"
                  >
                    <div className="font-tabular text-2xl sm:text-3xl font-semibold text-[#1E3D34] leading-none">
                      {unit.value}
                    </div>
                    <div className="text-xs text-[#5C5B55] mt-1.5">{unit.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
