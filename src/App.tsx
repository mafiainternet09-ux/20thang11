import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { WelcomeIntro } from './components/WelcomeIntro';
import { Navbar } from './components/Navbar';
import { HeroCountdownSection } from './components/HeroCountdownSection';
import { TeachersSection } from './components/TeachersSection';
import { MemoriesSection } from './components/MemoriesSection';
import { HomeroomSection } from './components/HomeroomSection';
import { VideoMemorySection } from './components/VideoMemorySection';
import { WishesWallSection, WishRecord } from './components/WishesWallSection';
import { FinaleSection } from './components/FinaleSection';
import { FallingPetals } from './components/FallingPetals';
import { soundEngine } from './utils/soundEngine';

const TRACKED_SECTIONS = ['trang-chu', 'thay-co', 'ky-niem', 'co-chu-nhiem', 'video', 'loi-chuc'];

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') !== '1';
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('trang-chu');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [highlightedWishes, setHighlightedWishes] = useState<WishRecord[]>([]);

  useEffect(() => {
    soundEngine.preload();
    return soundEngine.subscribe((playing) => {
      setIsMusicPlaying(playing);
    });
  }, []);

  const handleToggleMusic = useCallback(async () => {
    const playing = await soundEngine.toggleBackgroundMusic();
    setIsMusicPlaying(playing);
  }, []);

  const handleEnterSite = useCallback(() => {
    soundEngine.playEffect('chime');
    setShowIntro(false);
  }, []);

  const handleSkipIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [showIntro]);

  useEffect(() => {
    if (showIntro) return;
    const elements = TRACKED_SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0.05 }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [showIntro]);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1F2421]">
      <FallingPetals />
      <AnimatePresence>
        {showIntro && (
          <WelcomeIntro
            onEnter={handleEnterSite}
            onSkip={handleSkipIntro}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
          />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Navbar
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            onNavigate={scrollToSection}
          />

          <motion.main
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-x-clip"
          >
            <HeroCountdownSection
              onExploreTeachers={() => scrollToSection('thay-co')}
              onExploreHomeroom={() => scrollToSection('co-chu-nhiem')}
              isMusicPlaying={isMusicPlaying}
              onToggleMusic={handleToggleMusic}
            />
            <TeachersSection />
            <MemoriesSection />
            <HomeroomSection />
            <VideoMemorySection />
            <WishesWallSection onWishesLoaded={setHighlightedWishes} />
            <FinaleSection
              highlightedWishes={highlightedWishes}
              onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </motion.main>

          {/* Compact Audio Toggle Floating Control (appears after scrolling past hero) */}
          {scrollProgress > 0.08 && (
            <button
              type="button"
              onClick={handleToggleMusic}
              aria-pressed={isMusicPlaying}
              aria-label={isMusicPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
              className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161C1B]/90 hover:bg-[#161C1B] text-[#F9F7F2] border border-white/15 shadow-lg text-xs font-medium backdrop-blur-md transition-colors min-h-[44px]"
            >
              {isMusicPlaying ? (
                <Volume2 className="w-4 h-4 text-[#C97A2B]" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#D6CEBE]" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isMusicPlaying ? 'Đang phát nhạc' : 'Bật nhạc'}
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
