import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class AppLoggerService implements LoggerService {
  log(message: string, context?: string): void {
    this.write('log', message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.write('error', message, context, trace);
  }

  warn(message: string, context?: string): void {
    this.write('warn', message, context);
  }

  debug(message: string, context?: string): void {
    this.write('debug', message, context);
  }

  verbose(message: string, context?: string): void {
    this.write('verbose', message, context);
  }

  private write(level: LogLevel, message: string, context?: string, trace?: string): void {
    const timestamp = new Date().toISOString();
    const scope = context ? `[${context}]` : '';
    const line = `${timestamp} ${level.toUpperCase()} ${scope} ${message}`.trim();
    const print = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;

    print(line);
    if (trace) {
      print(trace);
    }
  }
}
