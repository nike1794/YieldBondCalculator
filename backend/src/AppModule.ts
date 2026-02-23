import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_TTL } from './common/Constants';
import { CorrelationIdMiddleware } from './common/CorrelationIdMiddleware';
import { GlobalExceptionFilter } from './common/GlobalExceptionFilter';
import { TimeoutInterceptor } from './common/TimeoutInterceptor';
import { BondController } from './controller/BondController';
import { BondService } from './service/BondService';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: RATE_LIMIT_TTL,
        limit: RATE_LIMIT_MAX_REQUESTS,
      },
    ]),
  ],
  controllers: [BondController],
  providers: [
    BondService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
