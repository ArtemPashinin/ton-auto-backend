import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatchEverythingFilter } from './exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)));
  app.enableCors({});
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
