import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AppLoggerService } from '../logger/logger.service';
import { DomainError } from './domain.error';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    this.logger.warn(`${exception.code}: ${exception.message}`, DomainErrorFilter.name);

    response.status(exception.httpStatus).json({
      statusCode: exception.httpStatus,
      error: exception.code,
      message: exception.message,
    });
  }
}
