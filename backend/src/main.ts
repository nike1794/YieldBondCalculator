import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import {
  CORS_ALLOWED_HEADERS,
  CORS_CREDENTIALS,
  CORS_METHODS,
  CORS_ORIGINS,
  DEFAULT_PORT,
} from './common/Constants';
import { logger } from './common/logger';

async function bootstrap() {
  logger.info('Application bootstrap started');
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors({
    origin: CORS_ORIGINS,
    methods: CORS_METHODS,
    allowedHeaders: CORS_ALLOWED_HEADERS,
    credentials: CORS_CREDENTIALS,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = process.env.PORT ?? DEFAULT_PORT;
  await app.listen(port);
  logger.info('Application is listening', { port });
}
bootstrap().catch((error: unknown) => {
  logger.error('Application bootstrap failed', error);
  process.exit(1);
});
