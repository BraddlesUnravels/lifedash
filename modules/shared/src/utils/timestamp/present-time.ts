import { DateTime } from 'luxon';

export type PresentationStyle =
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'dateOnly'
  | 'timeOnly'
  | 'relative'
  | string;

interface PresentationOptions {
  zone?: string;
  locale?: string;
}

/**
 * Present a Date/ISO/epoch string in a human-friendly manner.
 *
 * Presentation formats & examples below:
 * * 'short' = "Aug 30, 2:28 PM"
 * * 'medium' = "Aug 30, 2025, 2:28 PM"
 * * 'long' = "Saturday, August 30, 2025, 2:28 PM UTC"
 * * 'full' = "Saturday, August 30, 2025 at 2:28:23 PM Coordinated Universal Time"
 * * 'dateOnly' = "Aug 30, 2025"
 * * 'timeOnly' = "2:28 PM"
 * * 'relative' = "in 5 minutes", "3 days ago", or "2 hours ago"
 * Any other luxon compatible format string can also be used.
 * */

export function present(
  date: Date | DateTime | string | number = DateTime.utc(),
  style: PresentationStyle = 'short',
  { zone = 'local', locale = 'en' }: PresentationOptions = {},
): string {
  let dt: DateTime;
  // Normalise input
  if (DateTime.isDateTime(date)) {
    // Handle Luxon DateTime objects
    dt = date.setZone(zone).setLocale(locale);
  } else if (date instanceof Date) {
    dt = DateTime.fromJSDate(date, { zone }).setLocale(locale);
  } else if (typeof date === 'string') {
    dt = DateTime.fromISO(date, { zone }).setLocale(locale);
    if (!dt.isValid) {
      // Fallback to JS Date parsing for non-ISO strings
      dt = DateTime.fromJSDate(new Date(date), { zone }).setLocale(locale);
    }
  } else if (typeof date === 'number') {
    dt = DateTime.fromMillis(date, { zone }).setLocale(locale);
  } else {
    return '(invalid date)';
  }

  if (!dt.isValid) return '(invalid date)';

  switch (style) {
    case 'short':
      return dt.toLocaleString(DateTime.DATETIME_SHORT);
    case 'medium':
      return dt.toLocaleString(DateTime.DATETIME_MED);
    case 'long':
      return dt.toLocaleString(DateTime.DATETIME_FULL);
    case 'full':
      return dt.toLocaleString(DateTime.DATETIME_HUGE);
    case 'dateOnly':
      return dt.toLocaleString(DateTime.DATE_MED);
    case 'timeOnly':
      return dt.toLocaleString(DateTime.TIME_SIMPLE);
    case 'relative':
      return (
        dt.toRelative({
          base: DateTime.now().setZone(zone || DateTime.local().zoneName),
        }) || '(now)'
      ); // Fallback to "now" if relative time can't be determined
    default:
      return dt.toFormat(style);
  }
}
