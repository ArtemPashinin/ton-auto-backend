import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)));
  app.enableCors({
    // // origin: ['https://amraex.store']
    // methods: 'GET,POST,PUT,DELETE',
    // allowedHeaders: 'Content-Type, Authorization',
    // credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
