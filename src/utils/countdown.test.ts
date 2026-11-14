import test from 'node:test';
import assert from 'node:assert/strict';
import { getTeachersDayCountdown, getVietnamDateParts } from './countdown';

test('getVietnamDateParts converts UTC timestamp to Asia/Ho_Chi_Minh (UTC+7)', () => {
  // 2026-11-19T17:30:00Z is 2026-11-20T00:30:00+07:00
  const date = new Date('2026-11-19T17:30:00Z');
  const parts = getVietnamDateParts(date);
  assert.equal(parts.year, 2026);
  assert.equal(parts.month, 11);
  assert.equal(parts.day, 20);
  assert.equal(parts.hour, 0);
  assert.equal(parts.minute, 30);
});

test('countdown status is before Nov 20 and calculates exact remaining time', () => {
  // 2026-11-14 12:00:00+07:00 -> 5 days 12 hours until 2026-11-20 00:00:00+07:00
  const now = new Date('2026-11-14T05:00:00Z');
  const result = getTeachersDayCountdown(now);
  assert.equal(result.status, 'before');
  assert.equal(result.targetYear, 2026);
  assert.equal(result.days, 5);
  assert.equal(result.hours, 12);
  assert.equal(result.minutes, 0);
  assert.equal(result.seconds, 0);
  assert.equal(result.formattedDateLabel, '20/11/2026');
});

test('countdown status is today throughout entire Nov 20 in Asia/Ho_Chi_Minh', () => {
  const startOfDayVN = new Date('2026-11-19T17:00:00Z'); // 00:00:00+07:00
  const endOfDayVN = new Date('2026-11-20T16:59:59Z'); // 23:59:59+07:00

  const startRes = getTeachersDayCountdown(startOfDayVN);
  const endRes = getTeachersDayCountdown(endOfDayVN);

  assert.equal(startRes.status, 'today');
  assert.equal(startRes.targetYear, 2026);
  assert.equal(endRes.status, 'today');
  assert.equal(endRes.targetYear, 2026);
});

test('countdown rolls over to next year immediately after Nov 20 ends in Asia/Ho_Chi_Minh', () => {
  // 2026-11-21 00:00:00+07:00 = 2026-11-20T17:00:00Z
  const afterMidnightVN = new Date('2026-11-20T17:00:00Z');
  const result = getTeachersDayCountdown(afterMidnightVN);
  assert.equal(result.status, 'after');
  assert.equal(result.targetYear, 2027);
  assert.equal(result.days, 364);
  assert.equal(result.hours, 0);
  assert.equal(result.formattedDateLabel, '20/11/2027');
});
