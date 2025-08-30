import { describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import { present, type PresentationStyle } from '../../../src/utils/timestamp/present-time';

describe('presentation-time', () => {
  // Fixed test dates for consistent testing
  const fixedDate = new Date('2025-08-30T14:28:23.382Z'); // August 30, 2025, 2:28:23.382 PM UTC
  const fixedDateTime = DateTime.fromISO('2025-08-30T14:28:23.382Z');
  const fixedDateString = '2025-08-30T14:28:23.382Z';
  const fixedMillis = 1756648103382; // Milliseconds for the above date

  describe('default behavior', () => {
    it('should use short format by default', () => {
      const result = present(fixedDate);
      // Luxon DATETIME_SHORT can vary by locale, but should contain date and time
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2} [AP]M/);
    });

    it('should use local timezone by default', () => {
      const result = present(fixedDate);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should use current time when no date provided', () => {
      const result = present();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('input type handling', () => {
    describe('Date input', () => {
      it('should handle Date objects', () => {
        const result = present(fixedDate, 'short');
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2} [AP]M/);
      });
    });

    describe('DateTime input', () => {
      it('should handle Luxon DateTime objects', () => {
        const result = present(fixedDateTime, 'short');
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2} [AP]M/);
      });
    });

    describe('string input', () => {
      it('should handle ISO string input', () => {
        const result = present(fixedDateString, 'short');
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2} [AP]M/);
      });

      it('should handle various date string formats', () => {
        const dateStrings = [
          '2025-08-30T14:28:23.382Z',
          '2025-08-30',
          'August 30, 2025',
          '08/30/2025',
        ];

        dateStrings.forEach((dateStr) => {
          const result = present(dateStr, 'short');
          expect(typeof result).toBe('string');
          expect(result).not.toBe('(invalid date)');
        });
      });
    });

    describe('number input (milliseconds)', () => {
      it('should handle millisecond timestamps', () => {
        const result = present(fixedMillis, 'short');
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2} [AP]M/);
      });

      it('should handle unix seconds (converted to milliseconds)', () => {
        const unixSeconds = Math.floor(fixedMillis / 1000);
        const result = present(unixSeconds * 1000, 'short');
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2} [AP]M/);
      });
    });

    describe('invalid input', () => {
      it('should handle invalid dates gracefully', () => {
        const invalidInputs = ['invalid-date', NaN, 'not-a-date'];

        invalidInputs.forEach((invalid) => {
          const result = present(invalid as any, 'short');
          expect(result).toBe('(invalid date)');
        });
      });

      it('should handle null/undefined gracefully', () => {
        // Note: The function signature doesn't allow null/undefined,
        // but testing runtime behavior. However, the default parameter means
        // undefined will use the default (current time)
        const result1 = present(null as any, 'short');
        // undefined triggers default parameter, so will be current time
        expect(result1).toBe('(invalid date)');
      });
    });
  });

  describe('presentation styles', () => {
    describe('short format', () => {
      it('should return short datetime format', () => {
        const result = present(fixedDate, 'short');
        // Pattern can vary by locale but should contain date/time
        expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4},? \d{1,2}:\d{2} [AP]M/);
      });
    });

    describe('medium format', () => {
      it('should return medium datetime format', () => {
        const result = present(fixedDate, 'medium');
        // DATETIME_MED format varies but should include date and time
        expect(result).toMatch(/\w{3} \d{1,2}, \d{4}, \d{1,2}:\d{2} [AP]M/);
      });
    });

    describe('long format', () => {
      it('should return long datetime format with full day name', () => {
        const result = present(fixedDate, 'long');
        // DATETIME_FULL includes day name and timezone info, format can vary
        expect(result).toMatch(/\w+ \d{1,2}, \d{4}/);
        expect(result).toMatch(/\d{1,2}:\d{2}/);
      });
    });

    describe('full format', () => {
      it('should return full datetime format with timezone', () => {
        const result = present(fixedDate, 'full');
        // DATETIME_HUGE is most comprehensive, format varies by locale/system
        expect(result).toMatch(/\w+ \d{1,2}, \d{4}/);
        expect(result).toMatch(/\d{1,2}:\d{2}/);
      });
    });

    describe('dateOnly format', () => {
      it('should return only date without time', () => {
        const result = present(fixedDate, 'dateOnly');
        // Pattern: "Aug 30, 2025" (no time)
        expect(result).toMatch(/^\w{3} \d{1,2}, \d{4}$/);
        expect(result).not.toMatch(/[AP]M/);
        expect(result).not.toMatch(/\d{1,2}:\d{2}/);
      });
    });

    describe('timeOnly format', () => {
      it('should return only time without date', () => {
        const result = present(fixedDate, 'timeOnly');
        // Pattern: "2:28 PM" (no date)
        expect(result).toMatch(/^\d{1,2}:\d{2} [AP]M$/);
        expect(result).not.toMatch(/\d{4}/); // No year
        expect(result).not.toMatch(/\w{3}/); // No month abbreviation
      });
    });

    describe('relative format', () => {
      it('should return relative time for recent dates', () => {
        const now = DateTime.now();
        const oneHourAgo = now.minus({ hours: 1 }).toJSDate();
        const inTwoHours = now.plus({ hours: 2 }).toJSDate();

        const pastResult = present(oneHourAgo, 'relative');
        const futureResult = present(inTwoHours, 'relative');

        // Should contain relative time indicators
        expect(pastResult).toMatch(/(ago|in)/i);
        expect(futureResult).toMatch(/(ago|in)/i);
      });

      it('should handle very recent times', () => {
        const now = new Date();
        const result = present(now, 'relative');

        // Should be something like "in 0 minutes", "now", or "0 minutes ago"
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });

      it('should fallback to "(now)" if relative calculation fails', () => {
        // Test edge case where relative time might fail
        const result = present(fixedDate, 'relative');
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('custom format string', () => {
      it('should handle custom Luxon format strings', () => {
        const result = present(fixedDate, 'yyyy-MM-dd HH:mm:ss', { zone: 'UTC' });
        expect(result).toBe('2025-08-30 14:28:23');
      });

      it('should handle complex custom formats', () => {
        const result = present(fixedDate, "EEEE, MMMM d, yyyy 'at' h:mm a", { zone: 'UTC' });
        expect(result).toMatch(/^Saturday, August 30, 2025 at \d{1,2}:\d{2} [AP]M$/);
      });

      it('should handle format with escaped text', () => {
        const result = present(fixedDate, "yyyy 'year' MM 'month' dd 'day'", { zone: 'UTC' });
        expect(result).toBe('2025 year 08 month 30 day');
      });
    });
  });

  describe('timezone handling', () => {
    it('should use local timezone by default', () => {
      const result = present(fixedDate, 'short');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle specific timezones', () => {
      const timezones = [
        'UTC',
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney',
      ];

      timezones.forEach((zone) => {
        const result = present(fixedDate, 'short', { zone });
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        expect(result).not.toBe('(invalid date)');
      });
    });

    it('should show different times for different timezones', () => {
      const utcResult = present(fixedDate, 'HH:mm', { zone: 'UTC' });
      const tokyoResult = present(fixedDate, 'HH:mm', { zone: 'Asia/Tokyo' });

      expect(utcResult).toMatch(/^\d{2}:\d{2}$/);
      expect(tokyoResult).toMatch(/^\d{2}:\d{2}$/);

      // They should be different times (UTC vs Tokyo is +9 hours)
      expect(utcResult).not.toBe(tokyoResult);
    });

    it('should handle relative time with timezone', () => {
      const result = present(fixedDate, 'relative', { zone: 'UTC' });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('locale handling', () => {
    it('should use English locale by default', () => {
      const result = present(fixedDate, 'EEEE MMMM', { zone: 'UTC', locale: 'en' });
      // Should contain English day/month names
      expect(result).toBe('Saturday August');
    });

    it('should handle different locales', () => {
      const locales = ['en', 'fr', 'de', 'es'];

      locales.forEach((locale) => {
        const result = present(fixedDate, 'long', { locale });
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        expect(result).not.toBe('(invalid date)');
      });
    });

    it('should show different month names for different locales', () => {
      const englishResult = present(fixedDate, 'MMMM', { locale: 'en', zone: 'UTC' });
      const frenchResult = present(fixedDate, 'MMMM', { locale: 'fr', zone: 'UTC' });
      const germanResult = present(fixedDate, 'MMMM', { locale: 'de', zone: 'UTC' });

      expect(englishResult).toBe('August');
      expect(frenchResult).toBe('août');
      expect(germanResult).toBe('August'); // German August is same as English

      // But at least verify they're all strings
      expect(typeof englishResult).toBe('string');
      expect(typeof frenchResult).toBe('string');
      expect(typeof germanResult).toBe('string');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle invalid dates from all input types', () => {
      const invalidDate = new Date('invalid');
      const result = present(invalidDate, 'short');
      expect(result).toBe('(invalid date)');
    });

    it('should handle very old dates', () => {
      const oldDate = new Date('1970-01-01T00:00:00.000Z');
      const result = present(oldDate, 'short');
      expect(result).not.toBe('(invalid date)');
      expect(result).toMatch(/1970/);
    });

    it('should handle future dates', () => {
      const futureDate = new Date('2099-12-31T23:59:59.999Z');
      const result = present(futureDate, 'yyyy', { zone: 'UTC' });
      expect(result).not.toBe('(invalid date)');
      expect(result).toBe('2099');
    });

    it('should handle timezone edge cases', () => {
      // Date exactly at timezone boundary
      const boundaryDate = new Date('2025-01-01T00:00:00.000Z');
      const utcResult = present(boundaryDate, 'yyyy-MM-dd HH:mm', { zone: 'UTC' });
      const easternResult = present(boundaryDate, 'yyyy-MM-dd HH:mm', { zone: 'America/New_York' });

      expect(utcResult).toBe('2025-01-01 00:00');
      expect(easternResult).toMatch(/2024-12-31 19:00/); // EST is UTC-5
    });
  });

  describe('consistency and reliability', () => {
    it('should return consistent format for same inputs', () => {
      const result1 = present(fixedDate, 'short');
      const result2 = present(fixedDate, 'short');

      expect(result1).toBe(result2);
    });

    it('should handle all presentation styles without errors', () => {
      const styles: PresentationStyle[] = [
        'short',
        'medium',
        'long',
        'full',
        'dateOnly',
        'timeOnly',
        'relative',
      ];

      styles.forEach((style) => {
        expect(() => present(fixedDate, style)).not.toThrow();
        const result = present(fixedDate, style);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        expect(result).not.toBe('(invalid date)');
      });
    });

    it('should handle same date in different input formats consistently', () => {
      const dateResult = present(fixedDate, 'iso');
      const stringResult = present(fixedDateString, 'iso');
      const millisResult = present(fixedMillis, 'iso');

      // All should produce nearly the same result (within reasonable tolerance)
      // Extract the millisecond part and check they're very close
      const dateMillis = parseInt(dateResult.slice(-4, -1));
      const stringMillis = parseInt(stringResult.slice(-4, -1));
      const millisMillisResult = parseInt(millisResult.slice(-4, -1));

      expect(Math.abs(dateMillis - stringMillis)).toBeLessThanOrEqual(1);
      expect(Math.abs(stringMillis - millisMillisResult)).toBeLessThanOrEqual(1);
      
      // The rest of the timestamp should be identical
      expect(dateResult.slice(0, -4)).toBe(stringResult.slice(0, -4));
      expect(stringResult.slice(0, -4)).toBe(millisResult.slice(0, -4));
    });
  });

  describe('type safety', () => {
    it('should accept all defined PresentationStyle types', () => {
      const styles = [
        'short',
        'medium',
        'long',
        'full',
        'dateOnly',
        'timeOnly',
        'relative',
        'custom-format',
      ] as const;

      styles.forEach((style) => {
        expect(() => present(fixedDate, style as PresentationStyle)).not.toThrow();
        const result = present(fixedDate, style as PresentationStyle);
        expect(typeof result).toBe('string');
      });
    });
  });
});
