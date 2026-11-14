import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Heart, X } from 'lucide-react';
import { TEACHERS_LIST, TeacherProfile } from '../data/tributeData';
import { ResilientImage } from './ResilientImage';
import { soundEngine } from '../utils/soundEngine';

export function TeachersSection() {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTeacher) {
        setSelectedTeacher(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTeacher]);

  const openTeacher = (teacher: TeacherProfile) => {
    soundEngine.playEffect('paper');
    setSelectedTeacher(teacher);
  };

  return (
    <section
      id="thay-co"
      aria-labelledby="teachers-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#DED8CC]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#B4691E]">
              01 · Góc tri ân thầy cô
            </p>
            <h2
              id="teachers-heading"
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2421] mt-2 text-balance"
            >
              Những người lái đò thầm lặng
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5C5B55] max-w-md leading-relaxed">
            Nhấn vào từng tấm thiệp để mở lá thư riêng và kỷ niệm khó quên của tập thể lớp dành tặng thầy cô bộ môn.
          </p>
        </div>

        {/* 3-in-a-row editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEACHERS_LIST.map((teacher, idx) => (
            <motion.article
              key={teacher.id}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.6, delay: Math.min((idx % 3) * 0.08, 0.24), ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white border border-[#DED8CC] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#DED8CC] bg-[#EFECE5]">
                    <ResilientImage
                      src={teacher.image}
                      alt={`${teacher.name} - Giáo viên ${teacher.subject}`}
                      fallbackTitle={teacher.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5C5B55]">
                      <span className="font-medium text-[#1E3D34]">{teacher.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{teacher.yearsTogether}</span>
                    </div>
                    <h3 className="font-editorial text-2xl font-semibold text-[#1F2421] mt-1 leading-snug">
                      {teacher.name}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[#4A4943] leading-relaxed">
                  {teacher.shortWish}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EFECE5] flex items-center justify-between">
                <span className="text-xs text-[#5C5B55]">Thư & Kỷ niệm</span>
                <button
                  type="button"
                  onClick={() => openTeacher(teacher)}
                  aria-label={`Mở lời chúc và thư tri ân gửi ${teacher.name}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E3D34] bg-[#EFECE5] hover:bg-[#1E3D34] hover:text-[#F9F7F2] rounded-lg transition-colors min-h-[40px] whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Mở thư tri ân</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Teacher Tribute Detail Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="teacher-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedTeacher(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#F9F7F2] border border-[#DED8CC] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#DED8CC] bg-[#EFECE5]">
                <div className="flex items-center gap-2 text-xs text-[#5C5B55]">
                  <span className="font-semibold text-[#1E3D34]">{selectedTeacher.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedTeacher.yearsTogether}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTeacher(null)}
                  aria-label="Đóng không gian tri ân"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#1F2421] hover:bg-black/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#DED8CC]">
                    <ResilientImage
                      src={selectedTeacher.image}
                      alt={selectedTeacher.name}
                      fallbackTitle={selectedTeacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3
                      id="teacher-modal-title"
                      className="font-editorial text-3xl font-semibold text-[#1F2421]"
                    >
                      {selectedTeacher.name}
                    </h3>
                    <p className="mt-2 font-editorial italic text-lg text-[#1E3D34]">
                      “{selectedTeacher.shortWish}”
                    </p>
                  </div>
                </div>

                {/* Memorable Story Block */}
                <div className="rounded-xl bg-[#EFECE5] border border-[#DED8CC] p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B4691E] mb-2">
                    <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Kỷ niệm đáng nhớ cùng lớp</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#1F2421] leading-relaxed">
                    {selectedTeacher.memorableStory}
                  </p>
                </div>

                {/* Personal Letter */}
                <div className="bg-white border border-[#DED8CC] rounded-xl p-6 space-y-4">
                  <p className="text-xs uppercase tracking-widest text-[#5C5B55]">
                    Lá thư tri ân
                  </p>
                  <div className="space-y-3 text-sm sm:text-base text-[#2E2D29] leading-relaxed">
                    {selectedTeacher.letter.map((para, index) => (
                      <p key={index} className={index === 0 ? 'font-editorial italic text-lg font-semibold text-[#1F2421]' : ''}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
