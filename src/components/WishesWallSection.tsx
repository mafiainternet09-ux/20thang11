import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  AUTHOR_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  validateWishInput,
} from '../utils/wishesValidation';
import { soundEngine } from '../utils/soundEngine';

export interface WishRecord {
  id: string;
  author: string;
  message: string;
  created_at: string;
}

interface WishesWallSectionProps {
  onWishesLoaded?: (wishes: WishRecord[]) => void;
}

const PAGE_SIZE = 6;

export function WishesWallSection({ onWishesLoaded }: WishesWallSectionProps) {
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchWishes = useCallback(
    async (offset: number, append: boolean) => {
      try {
        if (append) setIsLoadingMore(true);
        else setIsLoading(true);
        setLoadError(null);

        const res = await fetch(`/api/wishes?limit=${PAGE_SIZE}&offset=${offset}`);
        if (!res.ok) {
          throw new Error('Không thể tải danh sách lời chúc.');
        }
        const data = (await res.json()) as {
          wishes: WishRecord[];
          total: number;
          hasMore: boolean;
        };

        setWishes((prev) => (append ? [...prev, ...data.wishes] : data.wishes));
        setTotal(data.total);
        setHasMore(data.hasMore);
      } catch {
        setLoadError('Hiện chưa thể kết nối máy chủ lời chúc. Vui lòng thử tải lại sau ít phút.');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    onWishesLoaded?.(wishes);
  }, [wishes, onWishesLoaded]);

  useEffect(() => {
    fetchWishes(0, false);
  }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitSuccess(null);

    const validation = validateWishInput({ author, message });
    if (!validation.ok) {
      setFormError(validation.error || 'Vui lòng kiểm tra lại lời chúc.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: validation.author,
          message: validation.message,
        }),
      });

      const payload = (await res.json()) as { wish?: WishRecord; error?: string };

      if (!res.ok || !payload.wish) {
        setFormError(payload.error || 'Không thể gửi lời chúc lúc này. Vui lòng thử lại.');
        return;
      }

      soundEngine.playEffect('chime');
      setWishes((prev) => [payload.wish!, ...prev]);
      setTotal((t) => t + 1);
      setAuthor('');
      setMessage('');
      setSubmitSuccess('Lời chúc của bạn đã được lưu lên bức tường tri ân!');
    } catch {
      setFormError('Lỗi kết nối mạng khi gửi lời chúc. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatWishDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return '';
    }
  };

  return (
    <section
      id="loi-chuc"
      aria-labelledby="wishes-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#EFECE5]/65 border-t border-[#DED8CC]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#B4691E]">
              05 · Bức tường lời chúc trực tuyến
            </p>
            <h2
              id="wishes-heading"
              className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2421] mt-2"
            >
              Gửi một tấm thiệp nhỏ đến Thầy Cô
            </h2>
          </div>
          <p className="text-sm text-[#5C5B55] max-w-md">
            Mỗi lời chúc gửi đi đều được lưu lại trực tuyến để thầy cô và tất cả thành viên cùng đọc lại bất cứ lúc nào.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card */}
          <div
            id="gui-loi-chuc"
            className="lg:col-span-5 bg-white border border-[#DED8CC] rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <h3 className="font-editorial text-2xl font-semibold text-[#1F2421]">
              Viết lời tri ân của bạn
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5B55] mt-1">
              Bạn có thể để trống tên để gửi dưới dạng “Ẩn danh”.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="wish-author"
                  className="block text-sm font-medium text-[#1F2421] mb-1.5"
                >
                  Tên người gửi <span className="text-[#5C5B55] font-normal">(không bắt buộc)</span>
                </label>
                <input
                  id="wish-author"
                  name="author"
                  type="text"
                  maxLength={AUTHOR_MAX_LENGTH}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ví dụ: Minh Thư · 12C3 (hoặc để trống)"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#DED8CC] bg-[#F9F7F2] text-sm text-[#1F2421] placeholder:text-[#8E8A80] focus:outline-none focus:border-[#1E3D34]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="wish-message"
                    className="block text-sm font-medium text-[#1F2421]"
                  >
                    Lời chúc gửi Thầy Cô
                  </label>
                  <span className="font-tabular text-xs text-[#5C5B55]">
                    {message.length} / {MESSAGE_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  id="wish-message"
                  name="message"
                  rows={5}
                  maxLength={MESSAGE_MAX_LENGTH}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết những điều bạn muốn nhắn gửi nhân ngày 20/11..."
                  className="w-full px-4 py-3 rounded-lg border border-[#DED8CC] bg-[#F9F7F2] text-sm text-[#1F2421] placeholder:text-[#8E8A80] focus:outline-none focus:border-[#1E3D34] resize-y"
                />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-lg bg-[#9E3B33]/10 border border-[#9E3B33]/30 px-4 py-3 text-sm text-[#872F28]"
                >
                  {formError}
                </div>
              )}

              {submitSuccess && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-lg bg-[#1E3D34]/10 border border-[#1E3D34]/30 px-4 py-3 text-sm text-[#1E3D34]"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1E3D34] hover:bg-[#162E27] disabled:opacity-60 text-[#F9F7F2] text-sm font-semibold transition-colors min-h-[44px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Đang gửi tấm thiệp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Gửi lời chúc</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Wishes Grid */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between text-xs sm:text-sm text-[#5C5B55]">
              <span>
                Tổng cộng <strong className="font-tabular text-[#1F2421]">{total}</strong> tấm thiệp đã gửi
              </span>
              <button
                type="button"
                onClick={() => fetchWishes(0, false)}
                className="underline underline-offset-4 hover:text-[#1F2421]"
              >
                Làm mới
              </button>
            </div>

            {isLoading ? (
              <div className="rounded-2xl bg-white border border-[#DED8CC] p-10 text-center text-sm text-[#5C5B55]">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1E3D34]" />
                Đang tải những tấm thiệp lời chúc...
              </div>
            ) : loadError ? (
              <div className="rounded-2xl bg-white border border-[#DED8CC] p-8 text-center space-y-3">
                <p className="text-sm text-[#872F28]">{loadError}</p>
                <button
                  type="button"
                  onClick={() => fetchWishes(0, false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1E3D34] text-[#F9F7F2]"
                >
                  Thử lại
                </button>
              </div>
            ) : wishes.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#DED8CC] p-10 text-center text-sm text-[#5C5B55]">
                Chưa có lời chúc nào. Hãy là người đầu tiên gửi tấm thiệp tri ân đến thầy cô nhé!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="wishes-list">
                {wishes.map((wish, idx) => (
                  <motion.article
                    key={wish.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.2) }}
                    className="bg-white border border-[#DED8CC] rounded-2xl p-5 flex flex-col justify-between shadow-sm"
                  >
                    <p className="text-sm sm:text-base text-[#1F2421] leading-relaxed whitespace-pre-line break-words">
                      “{wish.message}”
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#EFECE5] flex items-center justify-between gap-2 text-xs text-[#5C5B55]">
                      <span className="font-semibold text-[#1E3D34] truncate">{wish.author}</span>
                      <span className="font-tabular shrink-0">{formatWishDate(wish.created_at)}</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={isLoadingMore}
                  onClick={() => fetchWishes(wishes.length, true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-[#F9F7F2] border border-[#DED8CC] text-sm font-medium text-[#1F2421] min-h-[44px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải thêm...</span>
                    </>
                  ) : (
                    <span>Xem thêm lời chúc</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
