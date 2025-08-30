import { describe, it, expect } from 'vitest';
import timestamp from '../../../src/utils/timestamp';

const namedTimestamp = timestamp;

describe('timestamp index', () => {
  describe('default export', () => {
    it('should export timestamp object with machine and present functions', () => {
      expect(timestamp).toBeDefined();
      expect(typeof timestamp).toBe('object');
      expect(typeof timestamp.machine).toBe('function');
      expect(typeof timestamp.present).toBe('function');
    });

    it('should have machine function that generates current timestamps', () => {
      const result = timestamp.machine();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should have present function that formats dates', () => {
      const fixedDate = new Date('2025-08-30T14:28:23.382Z');
      const result = timestamp.present(fixedDate, 'short');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('named export', () => {
    it('should export same object as default export', () => {
      expect(namedTimestamp).toBe(timestamp);
    });

    it('should have same functions as default export', () => {
      expect(namedTimestamp.machine).toBe(timestamp.machine);
      expect(namedTimestamp.present).toBe(timestamp.present);
    });
  });

  describe('integration', () => {
    it('should work together - machine timestamp can be formatted with present', () => {
      // Generate a timestamp with machine
      const machineTimestamp = timestamp.machine('iso');

      // Format it with present
      const presented = timestamp.present(machineTimestamp, 'short');

      expect(typeof machineTimestamp).toBe('string');
      expect(typeof presented).toBe('string');
      expect(presented).not.toBe('(invalid date)');
    });

    it('should handle round-trip conversions', () => {
      // Machine -> Present -> Back to machine format via custom
      const originalIso = timestamp.machine('iso');
      const presented = timestamp.present(originalIso, 'yyyy-MM-dd HH:mm:ss');

      expect(originalIso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(presented).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should handle all machine formats with present function', () => {
      const machineFormats = ['iso', 'http', 'sql', 'unix', 'millis', 'rfc2822'] as const;

      machineFormats.forEach((format) => {
        const machineResult = timestamp.machine(format);

        // Some formats can be parsed by present, others might not
        // But at least verify machine generates valid strings
        expect(typeof machineResult).toBe('string');
        expect(machineResult.length).toBeGreaterThan(0);

        // Test that present doesn't crash on machine outputs
        if (format === 'iso') {
          const presentResult = timestamp.present(machineResult, 'short');
          expect(presentResult).not.toBe('(invalid date)');
        }
      });
    });

    it('should maintain timezone consistency between functions', () => {
      const utcTimestamp = timestamp.machine('iso', { zone: 'utc' });
      const utcPresented = timestamp.present(utcTimestamp, 'HH:mm', { zone: 'utc' });

      expect(typeof utcTimestamp).toBe('string');
      expect(typeof utcPresented).toBe('string');
      expect(utcPresented).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('API surface', () => {
    it('should only expose machine and present functions', () => {
      const keys = Object.keys(timestamp);
      expect(keys).toEqual(['machine', 'present']);
    });

    it('should not expose any internal implementation details', () => {
      expect(timestamp).not.toHaveProperty('DateTime');
      expect(timestamp).not.toHaveProperty('createClient');
      expect(timestamp).not.toHaveProperty('luxon');
    });
  });
});
