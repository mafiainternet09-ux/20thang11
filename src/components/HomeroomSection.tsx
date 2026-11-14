import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Expand, Heart, MailOpen, Sparkles } from 'lucide-react';
import { HOMEROOM_TEACHER } from '../data/tributeData';
import { ResilientImage } from './ResilientImage';
import { LightboxModal } from './LightboxModal';
import { soundEngine } from '../utils/soundEngine';

export function HomeroomSection() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [albumIndex, setAlbumIndex] = useState<number | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: introScroll } = useScroll({
    target: introRef,
    offset: ['start end', 'end start'],
  });
  const portraitParallaxY = useTransform(introScroll, [0, 1], ['-6%', '6%']);

  const handleToggleLetter = () => {
    setIsLetterOpen((prev) => {
      const next = !prev;
      if (next) {
        soundEngine.playEffect('seal');
      } else {
        soundEngine.playEffect('paper');
      }
      return next;
    });
  };

  return (
    <section
      id="co-chu-nhiem"
      aria-labelledby="homeroom-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#161C1B] text-[#F9F7F2]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Intro & Portrait */}
        <div ref={introRef} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#1F2725] aspect-[3/4] max-w-md mx-auto shadow-2xl">
              <motion.div style={{ y: portraitParallaxY }} className="w-full h-[112%] -mt-[6%] will-change-transform">
                <ResilientImage
                  src={HOMEROOM_TEACHER.portrait}
                  alt={HOMEROOM_TEACHER.name}
                  fallbackTitle={HOMEROOM_TEACHER.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs uppercase tracking-widest text-[#C97A2B]">
                  Không gian đặc biệt
                </p>
                <p className="font-editorial text-2xl font-semibold text-[#F9F7F2] mt-0.5">
                  {HOMEROOM_TEACHER.name}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#C97A2B]">
              03 · Gửi người mẹ thứ hai của lớp
            </p>
            <h2
              id="homeroom-heading"
              className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#F9F7F2] leading-[1.08] text-balance"
            >
              {HOMEROOM_TEACHER.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#D6CEBE]">
              <span>{HOMEROOM_TEACHER.role}</span>
              <span aria-hidden="true">·</span>
              <span>{HOMEROOM_TEACHER.yearsLabel}</span>
            </div>

            <blockquote className="pt-4 pb-2 border-y border-white/15 font-editorial italic text-2xl sm:text-3xl text-[#EFECE5] leading-relaxed">
              {HOMEROOM_TEACHER.highlightQuote}
            </blockquote>

            <p className="text-sm sm:text-base text-[#C7C1B5] leading-relaxed max-w-2xl">
              Dưới đây là ba món quà nhỏ tập thể lớp cất công chuẩn bị riêng dành cho cô: lá thư niêm phong sáp đỏ, dòng thời gian những ngày tháng có cô dẫn lối và cuốn album lưu giữ ánh nhìn dịu dàng nhất.
            </p>
          </div>
        </div>

        {/* PART 1: THE LETTER (Interactive Envelope) */}
        <div className="mt-20 sm:mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C97A2B]">
              Phần 1 · Lá thư niêm phong
            </p>
            <h3 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#F9F7F2] mt-2">
              {HOMEROOM_TEACHER.letterSubject}
            </h3>
            <p className="text-sm text-[#C7C1B5] mt-2">
              Nhấn vào phong bì hoặc nút bên dưới để mở lá thư chung của cả lớp.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Interactive Envelope Shell */}
            <div className="envelope-perspective">
              <div className="relative rounded-2xl bg-[#222B29] border border-white/15 p-6 sm:p-10 shadow-2xl overflow-hidden">
                {/* Envelope Header & Flap Visual */}
                <div className="relative flex flex-col items-center text-center">
                  <div
                    aria-hidden="true"
                    className={`envelope-flap w-full max-w-md h-24 rounded-t-xl border border-[#C97A2B]/35 bg-gradient-to-b from-[#2E3835] to-[#242D2B] flex items-end justify-center pb-3 mb-4 ${
                      isLetterOpen ? 'is-open opacity-40' : ''
                    }`}
                  >
                    <span className="text-xs tracking-widest uppercase text-[#D6CEBE]">
                      Gửi {HOMEROOM_TEACHER.name}
                    </span>
                  </div>

                  {/* Wax Seal & Action Button */}
                  <button
                    type="button"
                    onClick={handleToggleLetter}
                    aria-expanded={isLetterOpen}
                    aria-controls="homeroom-letter-paper"
                    className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#9E3B33] hover:bg-[#872F28] text-[#F9F7F2] font-semibold text-sm shadow-lg transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97A2B] min-h-[44px]"
                  >
                    <MailOpen className="w-4 h-4" aria-hidden="true" />
                    <span>{isLetterOpen ? 'Gấp lại phong bì thư' : 'Mở phong bì thư của lớp'}</span>
                  </button>
                </div>

                {/* Revealed Parchment Letter */}
                <AnimatePresence initial={false}>
                  {isLetterOpen && (
                    <motion.div
                      id="homeroom-letter-paper"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-8 rounded-xl bg-[#F9F7F2] text-[#1F2421] p-6 sm:p-10 border border-[#DED8CC] shadow-xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#DED8CC] text-xs text-[#5C5B55]">
                        <span>{HOMEROOM_TEACHER.letterDate}</span>
                        <span className="font-editorial italic text-sm text-[#9E3B33]">
                          Thư tay tập thể
                        </span>
                      </div>

                      <div className="mt-6 space-y-4 max-w-2xl mx-auto text-sm sm:text-base leading-[1.85] text-[#292524]">
                        <p className="font-editorial italic text-2xl font-semibold text-[#1E3D34]">
                          {HOMEROOM_TEACHER.letterSalutation}
                        </p>

                        {HOMEROOM_TEACHER.letterParagraphs.map((paragraph, i) => (
                          <p
                            key={i}
                            className={
                              i === 0
                                ? 'first-letter:font-editorial first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-[#9E3B33]'
                                : ''
                            }
                          >
                            {paragraph}
                          </p>
                        ))}

                        <div className="pt-6 border-t border-[#DED8CC] text-right">
                          <p className="font-editorial italic text-xl font-semibold text-[#1E3D34] whitespace-pre-line">
                            {HOMEROOM_TEACHER.letterSignature}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: OUR JOURNEY (Timeline) */}
        <div className="mt-24 sm:mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C97A2B]">
                Phần 2 · Hành trình Cô và Lớp
              </p>
              <h3 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#F9F7F2] mt-2">
                Những dấu ấn trên chuyến đò tri thức
              </h3>
            </div>
            <p className="text-sm text-[#C7C1B5] max-w-md">
              Mỗi cột mốc là một câu chuyện nhỏ mà cả lớp muốn cúi đầu cảm ơn cô.
            </p>
          </div>

          <div className="space-y-8">
            {HOMEROOM_TEACHER.journey.map((step, index) => (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24, y: 16 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch rounded-2xl bg-[#1F2725] border border-white/10 p-5 sm:p-7"
              >
                <div className="lg:col-span-5 rounded-xl overflow-hidden border border-white/10 min-h-[210px]">
                  <ResilientImage
                    src={step.image}
                    alt={step.title}
                    fallbackTitle={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#C97A2B]">
                      <span className="font-tabular font-medium">{step.chapter}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#D6CEBE]">{step.period}</span>
                    </div>
                    <h4 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F9F7F2] mt-2 leading-snug">
                      {step.title}
                    </h4>
                    <p className="mt-3 text-sm sm:text-base text-[#D6CEBE] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-start gap-2.5 text-sm text-[#EFECE5]">
                    <Heart className="w-4 h-4 text-[#C97A2B] shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="italic font-editorial text-lg leading-snug">
                      {step.gratitudeNote}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* PART 3: SPECIAL MEMORY ALBUM */}
        <div className="mt-24 sm:mt-28">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C97A2B]">
              Phần 3 · Album kỷ niệm dành riêng cho Cô
            </p>
            <h3 className="font-editorial text-3xl sm:text-4xl font-semibold text-[#F9F7F2] mt-2">
              Những khoảnh khắc chỉ muốn giữ mãi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOMEROOM_TEACHER.specialAlbum.map((photo, index) => (
              <figure
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#1F2725] aspect-[4/5]"
              >
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playEffect('shutter');
                    setAlbumIndex(index);
                  }}
                  aria-label={`Mở ảnh album cô chủ nhiệm: ${photo.title}`}
                  className="block w-full h-full text-left"
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
                  <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center">
                    <Expand className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <figcaption className="absolute bottom-0 inset-x-0 p-4">
                    <p className="text-xs text-[#C97A2B]">{photo.dateLabel}</p>
                    <p className="font-editorial text-xl font-semibold text-[#F9F7F2] mt-0.5">
                      {photo.title}
                    </p>
                  </figcaption>
                </button>
              </figure>
            ))}
          </div>

          {/* Closing Special Message */}
          <div className="mt-16 rounded-2xl border border-[#C97A2B]/35 bg-[#1F2725] p-8 sm:p-10 text-center max-w-4xl mx-auto">
            <Sparkles className="w-5 h-5 text-[#C97A2B] mx-auto mb-3" aria-hidden="true" />
            <p className="font-editorial italic text-2xl sm:text-3xl text-[#F9F7F2] leading-relaxed text-balance">
              {HOMEROOM_TEACHER.closingDedication}
            </p>
          </div>
        </div>
      </div>

      <LightboxModal
        photos={HOMEROOM_TEACHER.specialAlbum}
        activeIndex={albumIndex}
        onClose={() => setAlbumIndex(null)}
        onChangeIndex={setAlbumIndex}
      />
    </section>
  );
}
