interface PetalConfig {
  id: number;
  leftPercent: number;
  sizePx: number;
  durationSec: number;
  delaySec: number;
  swayPx: number;
  color: string;
  opacity: number;
  variant: 'rounded' | 'pointed';
}

const PETALS: PetalConfig[] = [
  { id: 1, leftPercent: 4, sizePx: 14, durationSec: 13, delaySec: -2, swayPx: 42, color: '#E3A78E', opacity: 0.65, variant: 'rounded' },
  { id: 2, leftPercent: 10, sizePx: 11, durationSec: 16, delaySec: -8, swayPx: -36, color: '#F1DFC8', opacity: 0.7, variant: 'pointed' },
  { id: 3, leftPercent: 16, sizePx: 16, durationSec: 14, delaySec: -5, swayPx: 50, color: '#C97A2B', opacity: 0.48, variant: 'rounded' },
  { id: 4, leftPercent: 22, sizePx: 12, durationSec: 18, delaySec: -11, swayPx: -44, color: '#D88373', opacity: 0.6, variant: 'pointed' },
  { id: 5, leftPercent: 28, sizePx: 15, durationSec: 12.5, delaySec: -3, swayPx: 34, color: '#F1DFC8', opacity: 0.72, variant: 'rounded' },
  { id: 6, leftPercent: 34, sizePx: 10, durationSec: 17, delaySec: -9, swayPx: -30, color: '#E3A78E', opacity: 0.58, variant: 'pointed' },
  { id: 7, leftPercent: 41, sizePx: 15, durationSec: 15, delaySec: -6, swayPx: 46, color: '#D88373', opacity: 0.55, variant: 'rounded' },
  { id: 8, leftPercent: 47, sizePx: 12, durationSec: 19, delaySec: -14, swayPx: -52, color: '#F1DFC8', opacity: 0.68, variant: 'pointed' },
  { id: 9, leftPercent: 53, sizePx: 14, durationSec: 13.5, delaySec: -1, swayPx: 38, color: '#C97A2B', opacity: 0.45, variant: 'rounded' },
  { id: 10, leftPercent: 59, sizePx: 11, durationSec: 16.5, delaySec: -7, swayPx: -35, color: '#E3A78E', opacity: 0.65, variant: 'pointed' },
  { id: 11, leftPercent: 65, sizePx: 16, durationSec: 14.5, delaySec: -10, swayPx: 48, color: '#F1DFC8', opacity: 0.7, variant: 'rounded' },
  { id: 12, leftPercent: 71, sizePx: 12, durationSec: 17.5, delaySec: -4, swayPx: -40, color: '#D88373', opacity: 0.55, variant: 'pointed' },
  { id: 13, leftPercent: 77, sizePx: 15, durationSec: 12.8, delaySec: -12, swayPx: 36, color: '#E3A78E', opacity: 0.62, variant: 'rounded' },
  { id: 14, leftPercent: 83, sizePx: 11, durationSec: 15.8, delaySec: -6, swayPx: -46, color: '#C97A2B', opacity: 0.48, variant: 'pointed' },
  { id: 15, leftPercent: 89, sizePx: 14, durationSec: 18.2, delaySec: -15, swayPx: 40, color: '#F1DFC8', opacity: 0.72, variant: 'rounded' },
  { id: 16, leftPercent: 95, sizePx: 12, durationSec: 14.2, delaySec: -3, swayPx: -34, color: '#D88373', opacity: 0.6, variant: 'pointed' },
];

export function FallingPetals() {
  return (
    <div
      aria-hidden="true"
      data-testid="falling-petals"
      className="falling-petals-layer fixed inset-0 z-[55] pointer-events-none overflow-hidden select-none"
    >
      {PETALS.map((petal) => (
        <span
          key={petal.id}
          className="falling-petal absolute -top-8 block will-change-transform"
          style={
            {
              left: `${petal.leftPercent}%`,
              width: `${petal.sizePx}px`,
              height: `${Math.round(petal.sizePx * 1.28)}px`,
              opacity: petal.opacity,
              animationDuration: `${petal.durationSec}s`,
              animationDelay: `${petal.delaySec}s`,
              '--petal-sway': `${petal.swayPx}px`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="0 0 24 30"
            fill="none"
            className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          >
            {petal.variant === 'rounded' ? (
              <path
                d="M12 1C18.5 5 22.5 11.5 21 19C19.6 25.4 15.6 29 12 29C8.4 29 4.4 25.4 3 19C1.5 11.5 5.5 5 12 1Z"
                fill={petal.color}
              />
            ) : (
              <path
                d="M12 1C16 7 21 12.5 19.5 19.5C18.2 25.2 14.5 28.5 12 29C9.5 28.5 5.8 25.2 4.5 19.5C3 12.5 8 7 12 1Z"
                fill={petal.color}
              />
            )}
          </svg>
        </span>
      ))}
    </div>
  );
}
