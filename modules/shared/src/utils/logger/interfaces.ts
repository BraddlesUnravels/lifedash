import type { LevelWithSilent } from 'pino';

export interface AppContext {
  service?: string;
  module?: string;
  operation?: string;
  userId?: string;
  sessionsId?: string;
  entity?: string;
}

export interface ServiceLoggerConfig {
  service: string;
  module?: string;
  level: LevelWithSilent;
  additionalContext?: Record<string, unknown>;
}
