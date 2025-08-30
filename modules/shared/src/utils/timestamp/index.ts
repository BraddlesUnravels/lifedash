import { machine, type MachineStampFormat } from './machine-time';
import { present, type PresentationStyle } from './present-time';

/**
 * Timestamp utilities for generating machine-readable and human-friendly timestamps.
 * Example import:
 * * import timestamp from '@app/shared/src/utils/timestamp';
 * * import { machine, present, type MachineStampFormat, type PresentationStyle } from '@app/shared/src/utils/timestamp';
 *
 * Example usages:
 * * const isoStamp = timestamp.machine('iso');
 * * const sqlStamp = timestamp.machine('sql', { zone: 'utc' });
 *
 * Human-friendly presentation
 * * const humanDate = timestamp.present(new Date(), 'long', { locale: 'en' });
 * * const relativeTime = timestamp.present(Date.now() - 3600000, 'relative');
 *
 * Working together:
 * * const nowReadable = timestamp.present(timestamp.machine('iso'), 'full', { zone: 'local' });
 * */

const timestamp = {
  machine,
  present,
};

export default timestamp;
export type { MachineStampFormat, PresentationStyle };
