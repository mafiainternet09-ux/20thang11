export type CountdownStatus = 'before' | 'today' | 'after';

export interface TeachersDayCountdown {
  status: CountdownStatus;
  targetYear: number;
  currentYearInVN: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedDateLabel: string;
}

const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

interface ZonedParts {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  hour: number;
  minute: number;
  second: number;
}

/**
 * Extracts calendar and clock parts in Asia/Ho_Chi_Minh (fixed UTC+7).
 * Using Intl.DateTimeFormat ensures accurate conversion regardless of host OS timezone.
 */
export function getVietnamDateParts(date: Date): ZonedParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const lookup: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      lookup[part.type] = Number.parseInt(part.value, 10);
    }
  }

  // Handle midnight hour '24' returned by some ICU locales
  const hour = lookup.hour === 24 ? 0 : lookup.hour;

  return {
    year: lookup.year,
    month: lookup.month,
    day: lookup.day,
    hour,
    minute: lookup.minute,
    second: lookup.second,
  };
}

/**
 * Converts a Vietnam wall-clock time (UTC+7) into an exact UTC epoch timestamp in ms.
 */
export function vietnamMidnightUtcMs(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day, 0, 0, 0, 0) - VIETNAM_OFFSET_MS;
}

/**
 * Computes the Teachers' Day (November 20) countdown in Asia/Ho_Chi_Minh timezone:
 * - Before Nov 20 of current year: counts down to Nov 20 of current year (status: 'before')
 * - During Nov 20 (00:00:00 to 23:59:59 UTC+7): celebrates Teachers' Day (status: 'today')
 * - After Nov 20: counts down to Nov 20 of next year (status: 'after')
 */
export function getTeachersDayCountdown(now: Date = new Date()): TeachersDayCountdown {
  const vn = getVietnamDateParts(now);
  const currentYear = vn.year;

  const isToday = vn.month === 11 && vn.day === 20;
  if (isToday) {
    return {
      status: 'today',
      targetYear: currentYear,
      currentYearInVN: currentYear,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedDateLabel: `20/11/${currentYear}`,
    };
  }

  const isAfterNov20 = vn.month > 11 || (vn.month === 11 && vn.day > 20);
  const targetYear = isAfterNov20 ? currentYear + 1 : currentYear;
  const status: CountdownStatus = isAfterNov20 ? 'after' : 'before';

  const targetUtcMs = vietnamMidnightUtcMs(targetYear, 11, 20);
  const diffMs = Math.max(0, targetUtcMs - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    status,
    targetYear,
    currentYearInVN: currentYear,
    days,
    hours,
    minutes,
    seconds,
    formattedDateLabel: `20/11/${targetYear}`,
  };
}
