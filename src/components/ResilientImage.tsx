import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EFECE5] via-[#E5E0D5] to-[#D6CEBE] text-[#5C5B55] p-6 text-center ${className}`}
      >
        <ImageIcon className="w-7 h-7 opacity-60 mb-2" aria-hidden="true" />
        <p className="font-editorial text-lg font-semibold text-[#1F2421]">
          {fallbackTitle || alt}
        </p>
        <span className="text-xs mt-1 opacity-75">Ảnh kỷ niệm 12C3</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
