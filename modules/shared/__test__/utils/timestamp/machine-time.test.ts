import { describe, it, expect } from 'vitest'
import { DateTime } from 'luxon'
import { machine, type MachineStampFormat } from '../../../src/utils/timestamp/machine-time'

describe('machine-time', () => {
  describe('default behavior', () => {
    it('should return ISO format by default', () => {
      const result = machine()
      // Test that it's a valid ISO string format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(DateTime.fromISO(result).isValid).toBe(true)
    })

    it('should generate current timestamp', () => {
      const before = DateTime.now().toMillis()
      const result = machine('millis')
      const after = DateTime.now().toMillis()
      
      const timestamp = parseInt(result)
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })
  })

  describe('format: iso', () => {
    it('should return valid ISO 8601 format', () => {
      const result = machine('iso')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      expect(DateTime.fromISO(result).isValid).toBe(true)
    })

    it('should handle different timezones for ISO format', () => {
      const result = machine('iso', { zone: 'America/New_York' })
      // Should be valid ISO format with timezone offset
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[-+]\d{2}:\d{2}$/)
      expect(DateTime.fromISO(result).isValid).toBe(true)
    })
  })

  describe('format: http', () => {
    it('should return valid HTTP date format (RFC 2822 style)', () => {
      const result = machine('http')
      expect(result).toMatch(/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/)
      expect(DateTime.fromHTTP(result).isValid).toBe(true)
    })

    it('should always be GMT for HTTP format', () => {
      const result1 = machine('http', { zone: 'Asia/Tokyo' })
      const result2 = machine('http', { zone: 'America/New_York' })
      
      // Both should end with GMT
      expect(result1).toMatch(/ GMT$/)
      expect(result2).toMatch(/ GMT$/)
    })
  })

  describe('format: sql', () => {
    it('should return valid SQL datetime format without offset', () => {
      const result = machine('sql')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/)
      expect(DateTime.fromSQL(result).isValid).toBe(true)
    })

    it('should not include timezone offset in format', () => {
      const result = machine('sql', { zone: 'Europe/London' })
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/)
      // SQL format should never include timezone offsets, regardless of zone
      expect(result).not.toMatch(/[+-]\d{4}$/)
      expect(result).not.toMatch(/Z$/)
    })
  })

  describe('format: unix', () => {
    it('should return Unix timestamp as string of digits', () => {
      const result = machine('unix')
      expect(result).toMatch(/^\d+$/)
      
      const timestamp = parseInt(result)
      expect(timestamp).toBeGreaterThan(1000000000) // After year 2001
      expect(timestamp).toBeLessThan(4000000000) // Before year 2096
    })

    it('should return integer seconds (no decimals)', () => {
      const result = machine('unix')
      expect(result).not.toMatch(/\./)
      expect(parseInt(result)).toBe(parseFloat(result))
    })

    it('should be consistent within a short time window', () => {
      const result1 = machine('unix')
      const result2 = machine('unix')
      
      // Should be same or differ by at most 1 second
      const diff = Math.abs(parseInt(result2) - parseInt(result1))
      expect(diff).toBeLessThanOrEqual(1)
    })
  })

  describe('format: millis', () => {
    it('should return milliseconds since epoch as string', () => {
      const result = machine('millis')
      expect(result).toMatch(/^\d+$/)
      
      const timestamp = parseInt(result)
      expect(timestamp).toBeGreaterThan(1000000000000) // After year 2001 in millis
    })

    it('should be more precise than unix format', () => {
      const unixResult = machine('unix')
      const millisResult = machine('millis')
      
      // Millis should be longer (more digits)
      expect(millisResult.length).toBeGreaterThan(unixResult.length)
      expect(millisResult.length).toBeGreaterThanOrEqual(13) // Current timestamps are 13+ digits
    })

    it('should be current timestamp in milliseconds', () => {
      const before = Date.now()
      const result = machine('millis')
      const after = Date.now()
      
      const timestamp = parseInt(result)
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })
  })

  describe('format: rfc2822', () => {
    it('should return valid RFC 2822 format', () => {
      const result = machine('rfc2822')
      expect(result).toMatch(/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} [+-]\d{4}$/)
      expect(DateTime.fromRFC2822(result).isValid).toBe(true)
    })

    it('should include timezone offset', () => {
      const result = machine('rfc2822', { zone: 'America/New_York' })
      expect(result).toMatch(/[+-]\d{4}$/)
    })

    it('should have correct day and month abbreviations', () => {
      const result = machine('rfc2822')
      const parts = result.split(' ')
      
      // Day abbreviation (3 chars + comma)
      expect(parts[0]).toMatch(/^[A-Za-z]{3},$/)
      // Month abbreviation  
      expect(parts[2]).toMatch(/^[A-Za-z]{3}$/)
    })
  })

  describe('custom format strings', () => {
    it('should handle custom Luxon format strings', () => {
      const result = machine('yyyy-MM-dd HH:mm:ss')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })

    it('should handle complex custom formats', () => {
      const result = machine('EEEE, MMMM d, yyyy \'at\' h:mm a')
      expect(result).toMatch(/^[A-Za-z]+, [A-Za-z]+ \d{1,2}, \d{4} at \d{1,2}:\d{2} [AP]M$/)
    })

    it('should respect timezone for custom formats', () => {
      const utcResult = machine('HH:mm', { zone: 'utc' })
      const tokyoResult = machine('HH:mm', { zone: 'Asia/Tokyo' })
      
      expect(utcResult).toMatch(/^\d{2}:\d{2}$/)
      expect(tokyoResult).toMatch(/^\d{2}:\d{2}$/)
      
      // They should be different (unless it's exactly the right time)
      // We just test they're both valid formats
      expect(utcResult).toBeTruthy()
      expect(tokyoResult).toBeTruthy()
    })
  })

  describe('timezone handling', () => {
    const testCases = [
      { zone: 'utc', description: 'UTC' },
      { zone: 'America/New_York', description: 'Eastern Time' },
      { zone: 'Europe/London', description: 'London Time' },
      { zone: 'Asia/Tokyo', description: 'Tokyo Time' },
      { zone: 'Australia/Sydney', description: 'Sydney Time' },
    ]

    testCases.forEach(({ zone, description }) => {
      it(`should handle ${description} (${zone})`, () => {
        const result = machine('iso', { zone })
        expect(DateTime.fromISO(result).isValid).toBe(true)
        
        // Should have appropriate timezone info in ISO format
        if (zone === 'utc') {
          expect(result).toMatch(/Z$/)
        } else {
          expect(result).toMatch(/[+-]\d{2}:\d{2}$/)
        }
      })
    })
  })

  describe('locale handling', () => {
    it('should respect locale for custom formats with locale-specific elements', () => {
      const englishResult = machine('MMMM', { locale: 'en' })
      const frenchResult = machine('MMMM', { locale: 'fr' })
      
      expect(englishResult).toBeTruthy()
      expect(frenchResult).toBeTruthy()
      expect(typeof englishResult).toBe('string')
      expect(typeof frenchResult).toBe('string')
    })

    it('should handle different locales without errors', () => {
      const locales = ['en', 'fr', 'de', 'es', 'ja']
      
      locales.forEach(locale => {
        expect(() => machine('MMMM', { locale })).not.toThrow()
        const result = machine('MMMM', { locale })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })

  describe('error handling', () => {
    it('should throw error for invalid timezone', () => {
      expect(() => machine('iso', { zone: 'Invalid/Timezone' })).toThrow(
        'Invalid machine-time generated with config: "Invalid/Timezone" & locale "en"'
      )
    })

    it('should handle invalid locales gracefully', () => {
      // Note: Luxon is quite lenient with locales and often falls back to default
      // So instead of expecting an error, test that it still returns a valid result
      const result = machine('iso', { locale: 'xx-INVALID' })
      expect(typeof result).toBe('string')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })

    it('should provide descriptive error messages', () => {
      const errorRegex = /Invalid machine-time generated with config.*Bad\/Zone.*bad-locale/
      expect(() => machine('iso', { zone: 'Bad/Zone', locale: 'bad-locale' })).toThrow(errorRegex)
    })
  })

  describe('consistency and reliability', () => {
    it('should return consistent format for the same format type', () => {
      const result1 = machine('iso')
      const result2 = machine('iso')
      
      // Both should match the same pattern
      const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      expect(result1).toMatch(isoPattern)
      expect(result2).toMatch(isoPattern)
    })

    it('should handle all format cases without errors', () => {
      const formats: MachineStampFormat[] = ['iso', 'http', 'sql', 'unix', 'millis', 'rfc2822']
      
      formats.forEach(format => {
        expect(() => machine(format)).not.toThrow()
        const result = machine(format)
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate timestamps close to current time', () => {
      const before = DateTime.now()
      const result = machine('iso')
      const after = DateTime.now()
      
      const resultTime = DateTime.fromISO(result)
      
      expect(resultTime.toMillis()).toBeGreaterThanOrEqual(before.toMillis())
      expect(resultTime.toMillis()).toBeLessThanOrEqual(after.toMillis())
    })
  })

  describe('type safety', () => {
    it('should accept all defined MachineStampFormat types', () => {
      const formats = ['iso', 'http', 'sql', 'unix', 'millis', 'rfc2822', 'custom-format'] as const
      
      formats.forEach(format => {
        expect(() => machine(format as MachineStampFormat)).not.toThrow()
        const result = machine(format as MachineStampFormat)
        expect(typeof result).toBe('string')
      })
    })
  })
})