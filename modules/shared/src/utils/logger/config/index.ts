import { envOptions as prodOptions } from './env.prod';
import { envOptions as devOptions } from './env.dev';
import { standardSerializers } from './serializers';

export function loggerBaseConfig() {
  const isDev = !!(process.env.NODE_ENV === 'development');
  const isStag = !!(process.env.NODE_ENV === 'staging');

  switch (true) {
    case isDev || isStag:
      return {
        ...devOptions,
        serializers: standardSerializers,
      };
    default:
      return {
        ...prodOptions,
        serializers: standardSerializers,
      };
  }
}
