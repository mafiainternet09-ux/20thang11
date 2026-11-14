import { useEffect, useRef, useState } from 'react';
import { Film, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { CLASS_MEMORIES, VIDEO_SECTION_DATA } from '../data/tributeData';
import { soundEngine } from '../utils/soundEngine';
import { ResilientImage } from './ResilientImage';

export function VideoMemorySection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasActivated, setHasActivated] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Slideshow fallback state when local MP4 hasn't been uploaded yet
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (!slideshowPlaying) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % CLASS_MEMORIES.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [slideshowPlaying]);

  const handleOpenVideo = async () => {
    setHasActivated(true);
    try {
      const head = await fetch(VIDEO_SECTION_DATA.videoUrl, { method: 'HEAD' });
      const contentType = head.headers.get('content-type') || '';
      if (head.ok && contentType.includes('video')) {
        setVideoAvailable(true);
        soundEngine.stopBackgroundMusic();
        window.setTimeout(() => {
          videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
        }, 80);
      } else {
        setVideoAvailable(false);
      }
    } catch {
      setVideoAvailable(false);
    }
  };

  const togglePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      soundEngine.stopBackgroundMusic();
      vid.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val > 0 && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const formatTime = (sec: number) => {
    if (!Number.isFinite(sec) || sec <= 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section
      id="video"
      aria-labelledby="video-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#DED8CC]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#B4691E]">
              04 · Video kỷ niệm
            </p>
            <h2
              id="video-heading"
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2421] mt-2"
            >
              {VIDEO_SECTION_DATA.title}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5C5B55] max-w-md">
            {VIDEO_SECTION_DATA.subtitle}
          </p>
        </div>

        {/* Video Stage (No autoplay, no heavy video preloaded until opened) */}
        <div className="rounded-2xl overflow-hidden border border-[#DED8CC] bg-[#161C1B] text-[#F9F7F2] shadow-lg">
          {!hasActivated ? (
            <div className="relative aspect-video">
              <ResilientImage
                src={VIDEO_SECTION_DATA.posterImage}
                alt={VIDEO_SECTION_DATA.title}
                fallbackTitle={VIDEO_SECTION_DATA.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <button
                  type="button"
                  onClick={handleOpenVideo}
                  aria-label="Mở trình phát video kỷ niệm lớp"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[#F9F7F2] hover:bg-[#EFECE5] text-[#161C1B] font-semibold text-sm sm:text-base shadow-xl transition-transform duration-200 hover:scale-105 min-h-[48px]"
                >
                  <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                  <span>Phát thước phim kỷ niệm</span>
                </button>
                <p className="mt-4 text-xs sm:text-sm text-[#D6CEBE]">
                  {VIDEO_SECTION_DATA.durationLabel} · Chỉ tải video khi bạn nhấn phát
                </p>
              </div>
            </div>
          ) : videoAvailable === true ? (
            <div>
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={VIDEO_SECTION_DATA.videoUrl}
                  poster={VIDEO_SECTION_DATA.posterImage}
                  preload="metadata"
                  playsInline
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => setVideoAvailable(false)}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Custom Accessible Controls */}
              <div className="px-4 sm:px-6 py-3.5 bg-[#1F2725] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Tạm dừng video' : 'Phát video'}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#C97A2B] hover:bg-[#B4691E] text-[#161C1B] text-xs font-semibold min-h-[40px]"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Tạm dừng' : 'Phát'}</span>
                  </button>

                  <span className="font-tabular text-xs text-[#D6CEBE]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-1 max-w-xs">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    aria-label="Tua thời gian video"
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (videoRef.current) videoRef.current.currentTime = next;
                      setCurrentTime(next);
                    }}
                    className="w-full accent-[#C97A2B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Bật âm thanh video' : 'Tắt âm thanh video'}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 text-[#EFECE5]"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    aria-label="Âm lượng video"
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 accent-[#C97A2B] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Graceful Placeholder when MP4 has not been added yet */
            <div>
              <div className="relative aspect-video overflow-hidden">
                <ResilientImage
                  src={CLASS_MEMORIES[slideIdx].image}
                  alt={CLASS_MEMORIES[slideIdx].title}
                  fallbackTitle={VIDEO_SECTION_DATA.title}
                  className="w-full h-full object-cover transition-opacity duration-700"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30"
                />

                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-xs text-[#C97A2B]">
                    <Film className="w-4 h-4" aria-hidden="true" />
                    <span>Chế độ trình chiếu mẫu · Sẵn sàng thay bằng file MP4</span>
                  </div>

                  <div className="max-w-xl">
                    <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#F9F7F2]">
                      {CLASS_MEMORIES[slideIdx].title}
                    </h3>
                    <p className="text-sm text-[#E5E0D5] mt-1">
                      {CLASS_MEMORIES[slideIdx].caption}
                    </p>
                    <p className="text-xs text-[#C7C1B5] mt-3 leading-relaxed">
                      {VIDEO_SECTION_DATA.placeholderNote}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-[#1F2725] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSlideshowPlaying((p) => !p)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C97A2B] hover:bg-[#B4691E] text-[#161C1B] text-xs font-semibold min-h-[40px]"
                >
                  {slideshowPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{slideshowPlaying ? 'Tạm dừng trình chiếu ảnh' : 'Xem trình chiếu kỷ niệm'}</span>
                </button>
                <span className="font-tabular text-xs text-[#D6CEBE]">
                  Khung hình {slideIdx + 1} / {CLASS_MEMORIES.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
