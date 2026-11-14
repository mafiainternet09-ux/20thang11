export const AUTHOR_MAX_LENGTH = 60;
export const MESSAGE_MIN_LENGTH = 3;
export const MESSAGE_MAX_LENGTH = 600;
export const WISH_COOLDOWN_MS = 20_000;

export interface WishInput {
  author?: string;
  message: string;
}

export interface WishValidationResult {
  ok: boolean;
  error?: string;
  author: string;
  message: string;
}

/**
 * Strips HTML tags and normalizes whitespace so user input is always stored & rendered as plain text.
 */
export function sanitizePlainText(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const SPAM_PATTERNS: RegExp[] = [
  /https?:\/\/\S+/i,
  /www\.\S+/i,
  /(.)\1{11,}/, // 12+ identical repeated characters
  /\b(casino|bet88|kubet|sex|xxx|crypto\s*airdrop|vay\s*tiền\s*nhanh)\b/i,
];

export function containsSpam(text: string): boolean {
  return SPAM_PATTERNS.some((pattern) => pattern.test(text));
}

export function validateWishInput(input: WishInput): WishValidationResult {
  const cleanAuthor = sanitizePlainText(input.author ?? '');
  const cleanMessage = sanitizePlainText(input.message ?? '');

  if (!cleanMessage) {
    return {
      ok: false,
      error: 'Vui lòng nhập lời chúc gửi đến thầy cô.',
      author: cleanAuthor || 'Ẩn danh',
      message: '',
    };
  }

  if (cleanMessage.length < MESSAGE_MIN_LENGTH) {
    return {
      ok: false,
      error: `Lời chúc cần có ít nhất ${MESSAGE_MIN_LENGTH} ký tự.`,
      author: cleanAuthor || 'Ẩn danh',
      message: cleanMessage,
    };
  }

  if (cleanMessage.length > MESSAGE_MAX_LENGTH) {
    return {
      ok: false,
      error: `Lời chúc không được vượt quá ${MESSAGE_MAX_LENGTH} ký tự.`,
      author: cleanAuthor || 'Ẩn danh',
      message: cleanMessage,
    };
  }

  if (cleanAuthor.length > AUTHOR_MAX_LENGTH) {
    return {
      ok: false,
      error: `Tên người gửi không được vượt quá ${AUTHOR_MAX_LENGTH} ký tự.`,
      author: cleanAuthor,
      message: cleanMessage,
    };
  }

  if (containsSpam(cleanMessage) || containsSpam(cleanAuthor)) {
    return {
      ok: false,
      error: 'Nội dung có chứa liên kết hoặc ký tự lặp bất thường, vui lòng kiểm tra lại.',
      author: cleanAuthor || 'Ẩn danh',
      message: cleanMessage,
    };
  }

  return {
    ok: true,
    author: cleanAuthor || 'Ẩn danh',
    message: cleanMessage,
  };
}
