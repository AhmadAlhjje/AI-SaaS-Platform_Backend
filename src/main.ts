import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './shared/exceptions/domain-error.filter';
import { HttpExceptionFilter } from './shared/exceptions/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { AppLoggerService } from './shared/logger/logger.service';
import { AppValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  app.useGlobalPipes(new AppValidationPipe());
  // Order matters: DomainErrorFilter must be registered before the catch-all
  // HttpExceptionFilter so DomainError instances are handled by the specific one.
  app.useGlobalFilters(new DomainErrorFilter(logger), new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new LoggingInterceptor(logger), new ResponseInterceptor());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`, 'Bootstrap');
}

bootstrap();
