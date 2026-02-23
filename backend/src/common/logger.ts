import { RequestContext } from './RequestContext';

class AppLogger {
  private readonly context = 'BondYieldApp';

  info(message: string, meta?: unknown): void {
    this.write('INFO', message, meta);
  }

  error(message: string, error?: unknown): void {
    const payload =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error;
    this.write('ERROR', message, payload);
  }

  private serialize(value: unknown): string {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  private write(
    level: 'INFO' | 'ERROR',
    message: string,
    meta?: unknown,
  ): void {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      correlationId: RequestContext.getCorrelationId() ?? null,
      message,
      ...(meta === undefined ? {} : { meta }),
    };
    process.stdout.write(`${this.serialize(payload)}\n`);
  }
}

export const logger = new AppLogger();
