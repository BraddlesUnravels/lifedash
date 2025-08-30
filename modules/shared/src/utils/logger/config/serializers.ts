import pino from 'pino';

export const standardSerializers = {
  err: pino.stdSerializers.err,
  error: pino.stdSerializers.err,
  req: pino.stdSerializers.req,
  res: pino.stdSerializers.res,
};
