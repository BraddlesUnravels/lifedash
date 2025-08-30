import { DateTime } from 'luxon';

export type MachineStampFormat = 'iso' | 'http' | 'sql' | 'unix' | 'millis' | 'rfc2822' | string;

interface MachineStampOptions {
  zone?: string;
  locale?: string;
}

/**
 * Generate a machine-friendly timestamp in the given format.
 * * Defaults to ISO 8601 in UTC.
 * * Locale defaults to 'en'.
 * * Supports 'iso', 'http', 'sql', 'unix', 'millis', and 'rfc2822' formats.
 * * Accepts any luxon-compatible format string.
 *
 * Example usages:
 *
 * * machine('iso') || machine(); = UTC eg. "2025-08-30T14:28:23.382Z"
 * * machine('sql', { zone: 'utc' }); = SQL format eg. "2025-08-30 14:28:23"
 * * machine('http', { zone: 'local' }); = HTTP format eg. "Sat, 30 Aug 2025 14:28:23 GMT"
 * * machine('unix', { zone: 'local' }); = Unix epoch seconds eg. "1693409303"
 * * machine('millis', { zone: 'utc' }); = Unix epoch milliseconds eg. "1693409303382"
 * * machine('rfc2822', { zone: 'utc' }); = RFC 2822 format eg. "Sat, 30 Aug 2025 14:28:23 +0000"
 * * machine('yyyy LLL dd - HH:mm:ss ZZZZ', { zone: 'America/New_York', locale: 'en' }); = Custom format eg. "2025 Aug 30 - 10:28:23 EDT"
 * */

export function machine(
  format: MachineStampFormat = 'iso',
  { zone = 'utc', locale = 'en' }: MachineStampOptions = {},
): string {
  const dt = DateTime.now().setZone(zone).setLocale(locale);

  if (!dt.isValid)
    throw new Error(`Invalid machine-time generated with config: "${zone}" & locale "${locale}"`);

  switch (format) {
    case 'iso':
      return dt.toISO();
    case 'http':
      return dt.toHTTP();
    case 'sql':
      return dt.toSQL({ includeOffset: false });
    case 'unix':
      return Math.floor(dt.toSeconds()).toString();
    case 'millis':
      return dt.toMillis().toString();
    case 'rfc2822':
      return dt.toRFC2822();
    default:
      return dt.toFormat(format);
  }
}
