import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<TData> {
  readonly success: true;
  readonly data: TData;
}

@Injectable()
export class ResponseInterceptor<TData> implements NestInterceptor<TData, ApiResponse<TData>> {
  intercept(_context: ExecutionContext, next: CallHandler<TData>): Observable<ApiResponse<TData>> {
    return next.handle().pipe(map((data) => ({ success: true as const, data })));
  }
}
