import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CLASS_INFO } from '../data/tributeData';

export interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'thay-co', label: 'Thầy cô' },
  { id: 'ky-niem', label: 'Kỷ niệm' },
  { id: 'co-chu-nhiem', label: 'Cô chủ nhiệm' },
  { id: 'video', label: 'Video' },
  { id: 'loi-chuc', label: 'Lời chúc' },
];

interface NavbarProps {
  activeSection: string;
  scrollProgress: number;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, scrollProgress, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleLinkClick = (sectionId: string) => {
    setMobileOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F9F7F2]/92 backdrop-blur-md border-b border-[#DED8CC]">
      {/* Scroll Progress Line */}
      <div
        aria-hidden="true"
        className="h-[2px] bg-[#1E3D34] transition-transform duration-150 origin-left"
        style={{ transform: `scaleX(${Math.min(Math.max(scrollProgress, 0), 1)})` }}
      />

      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#trang-chu"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('trang-chu');
          }}
          className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-[#1F2421] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3D34]"
        >
          {CLASS_INFO.themeTitle}
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav aria-label="Điều hướng chính" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                aria-current={isActive ? 'location' : undefined}
                className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-[#1E3D34] border-[#1E3D34]'
                    : 'text-[#5C5B55] border-transparent hover:text-[#1F2421] hover:border-[#DED8CC]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA on desktop + Hamburger on mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('gui-loi-chuc')}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#F9F7F2] bg-[#1E3D34] hover:bg-[#162E27] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            Gửi lời chúc
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#1F2421] hover:bg-[#EFECE5] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Menu di động"
          className="md:hidden border-t border-[#DED8CC] bg-[#F9F7F2] px-4 py-4 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium min-h-[44px] ${
                  isActive
                    ? 'bg-[#EFECE5] text-[#1E3D34]'
                    : 'text-[#1F2421] hover:bg-[#EFECE5]/60'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleLinkClick('gui-loi-chuc')}
              className="w-full py-3 px-4 bg-[#1E3D34] text-[#F9F7F2] text-sm font-semibold rounded-lg min-h-[44px]"
            >
              Gửi lời chúc đến Thầy Cô
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
