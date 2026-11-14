export type SoundEffectType = 'chime' | 'paper' | 'seal' | 'shutter';

const YOUTUBE_TRACK_ID = 'F78uqULgIc0';

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTGlobal {
  Player: new (
    elementId: string | HTMLElement,
    options: {
      videoId: string;
      width?: number | string;
      height?: number | string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayerInstance }) => void;
        onStateChange?: (event: { target: YTPlayerInstance; data: number }) => void;
        onError?: (event: { data: number }) => void;
      };
    }
  ) => YTPlayerInstance;
  PlayerState?: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
  };
}

declare global {
  interface Window {
    YT?: YTGlobal;
    onYouTubeIframeAPIReady?: () => void;
  }
}

class TributeSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private audioEl: HTMLAudioElement | null = null;
  private loopTimer: number | null = null;
  private stepIndex = 0;
  private masterGain: GainNode | null = null;
  private customAudioPath = '/assets/audio/background-theme.mp3';

  private ytPlayer: YTPlayerInstance | null = null;
  private ytContainer: HTMLDivElement | null = null;
  private ytReady = false;
  private ytFailed = false;
  private ytInitStarted = false;
  private ytRetryTimer: number | null = null;
  private listeners = new Set<(playing: boolean) => void>();

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.isPlaying);
    }
  }

  public preload(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (this.ytInitStarted || this.ytFailed) return;
    this.ytInitStarted = true;
    this.initYouTubePlayer();
  }

  private createYouTubeContainer(): HTMLElement {
    if (!this.ytContainer) {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('aria-hidden', 'true');
      wrapper.style.position = 'fixed';
      wrapper.style.bottom = '0';
      wrapper.style.right = '0';
      wrapper.style.width = '200px';
      wrapper.style.height = '113px';
      wrapper.style.opacity = '0.001';
      wrapper.style.pointerEvents = 'none';
      wrapper.style.zIndex = '-1';
      wrapper.style.overflow = 'hidden';

      const target = document.createElement('div');
      target.id = 'yt-bg-music-player';
      wrapper.appendChild(target);
      document.body.appendChild(wrapper);
      this.ytContainer = wrapper;
    }
    return this.ytContainer.firstElementChild as HTMLElement;
  }

  private initYouTubePlayer(): void {
    const createPlayer = () => {
      if (!window.YT?.Player || this.ytPlayer || this.ytFailed) return;
      try {
        const target = this.createYouTubeContainer();
        this.ytPlayer = new window.YT.Player(target, {
          videoId: YOUTUBE_TRACK_ID,
          width: 200,
          height: 113,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            modestbranding: 1,
            playlist: YOUTUBE_TRACK_ID,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              this.ytReady = true;
              event.target.setVolume(45);
              if (this.isPlaying) {
                try {
                  event.target.unMute();
                  event.target.setVolume(45);
                  event.target.playVideo();
                  this.schedulePlayHealthCheck();
                } catch {
                  this.fallbackToAmbient();
                }
              }
            },
            onStateChange: (event) => {
              // 0 = ENDED, 1 = PLAYING, 2 = PAUSED, 3 = BUFFERING
              if (event.data === 0 && this.isPlaying) {
                event.target.seekTo(0, true);
                event.target.playVideo();
              } else if (event.data === 1 || event.data === 3) {
                this.clearRetryTimer();
                this.stopFallbackAudio();
              }
            },
            onError: () => {
              this.ytFailed = true;
              this.clearRetryTimer();
              if (this.isPlaying) {
                this.fallbackToAmbient();
              }
            },
          },
        });
      } catch {
        this.ytFailed = true;
      }
    };

    if (window.YT?.Player) {
      createPlayer();
      return;
    }

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      createPlayer();
    };

    if (!document.querySelector('script[data-yt-iframe-api="true"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.ytIframeApi = 'true';
      script.onerror = () => {
        this.ytFailed = true;
        if (this.isPlaying) {
          this.fallbackToAmbient();
        }
      };
      document.head.appendChild(script);
    }
  }

  private clearRetryTimer(): void {
    if (this.ytRetryTimer !== null) {
      window.clearTimeout(this.ytRetryTimer);
      this.ytRetryTimer = null;
    }
  }

  private schedulePlayHealthCheck(): void {
    this.clearRetryTimer();
    this.ytRetryTimer = window.setTimeout(() => {
      if (!this.isPlaying || this.ytFailed || !this.ytPlayer) return;
      try {
        const state = this.ytPlayer.getPlayerState();
        // Keep YouTube active if playing (1) or buffering (3)
        if (state !== 1 && state !== 3) {
          this.ytFailed = true;
          this.fallbackToAmbient();
        }
      } catch {
        this.ytFailed = true;
        this.fallbackToAmbient();
      }
    }, 4500);
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.22;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }

  public async toggleBackgroundMusic(): Promise<boolean> {
    if (this.isPlaying) {
      this.stopBackgroundMusic();
      return false;
    }
    await this.startBackgroundMusic();
    return this.isPlaying;
  }

  public async startBackgroundMusic(): Promise<void> {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.notifyListeners();

    this.preload();

    // Primary source: YouTube audio track (F78uqULgIc0)
    if (!this.ytFailed) {
      if (this.ytReady && this.ytPlayer) {
        try {
          this.ytPlayer.unMute();
          this.ytPlayer.setVolume(45);
          this.ytPlayer.playVideo();
          this.schedulePlayHealthCheck();
          return;
        } catch {
          this.ytFailed = true;
        }
      } else {
        // Player is initializing; onReady will automatically start playback.
        // Guard with a timeout in case offline / YouTube API script is blocked.
        this.clearRetryTimer();
        this.ytRetryTimer = window.setTimeout(() => {
          if (this.isPlaying && !this.ytReady && !this.ytFailed) {
            this.ytFailed = true;
            this.fallbackToAmbient();
          }
        }, 5000);
        return;
      }
    }

    await this.fallbackToAmbient();
  }

  private async fallbackToAmbient(): Promise<void> {
    if (!this.isPlaying) return;

    // Optional local MP3 fallback if placed in public/assets/audio/background-theme.mp3
    try {
      const headRes = await fetch(this.customAudioPath, { method: 'HEAD' });
      const contentType = headRes.headers.get('content-type') || '';
      if (headRes.ok && contentType.includes('audio')) {
        if (!this.audioEl) {
          this.audioEl = new Audio(this.customAudioPath);
          this.audioEl.loop = true;
          this.audioEl.volume = 0.35;
        }
        await this.audioEl.play();
        return;
      }
    } catch {
      // Fall through to synthesized piano notes
    }

    const ctx = this.ensureContext();
    if (!ctx) {
      this.isPlaying = false;
      this.notifyListeners();
      return;
    }

    if (this.loopTimer !== null) return;

    const progression = [
      [349.23, 440.0, 523.25], // Fmaj
      [329.63, 392.0, 493.88], // Em
      [293.66, 349.23, 440.0], // Dm
      [261.63, 329.63, 392.0], // Cmaj
    ];

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const chord = progression[Math.floor(this.stepIndex / 4) % progression.length];
      const freq = chord[this.stepIndex % chord.length];
      this.playSoftBell(freq, 2.6, 0.14);
      if (this.stepIndex % 4 === 0) {
        this.playSoftBell(chord[0] / 2, 3.4, 0.08);
      }
      this.stepIndex += 1;
    };

    playNextNote();
    this.loopTimer = window.setInterval(playNextNote, 1150);
  }

  private stopFallbackAudio(): void {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
  }

  public stopBackgroundMusic(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.clearRetryTimer();

    if (this.ytPlayer && this.ytReady) {
      try {
        this.ytPlayer.pauseVideo();
      } catch {
        // Ignore player teardown errors
      }
    }

    this.stopFallbackAudio();
    this.notifyListeners();
  }

  private playSoftBell(freq: number, durationSec: number, peakGain: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(peakGain, now + 0.06);
    env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(env);
    env.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  }

  public playEffect(type: SoundEffectType): void {
    if (!this.isPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    if (type === 'chime') {
      this.playSoftBell(587.33, 0.9, 0.12);
      window.setTimeout(() => this.playSoftBell(880.0, 1.1, 0.09), 90);
    } else if (type === 'seal') {
      this.playSoftBell(440.0, 1.2, 0.14);
      window.setTimeout(() => this.playSoftBell(523.25, 1.4, 0.12), 110);
      window.setTimeout(() => this.playSoftBell(659.25, 1.8, 0.11), 220);
    } else if (type === 'paper') {
      this.playSoftBell(659.25, 0.45, 0.07);
    } else if (type === 'shutter') {
      this.playSoftBell(783.99, 0.28, 0.06);
    }
  }
}

export const soundEngine = new TributeSoundEngine();
