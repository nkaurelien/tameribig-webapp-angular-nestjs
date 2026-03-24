import { Logger, LoggerService } from '@nestjs/common';

export class AppLogger extends Logger implements LoggerService {
  constructor(context?: string) {
    super(context);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    super.log(message, ...optionalParams);
  }

  error(message: unknown, trace?: string, ...optionalParams: unknown[]): void {
    super.error(message, trace, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    super.warn(message, ...optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    super.debug(message, ...optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    super.verbose(message, ...optionalParams);
  }
}
