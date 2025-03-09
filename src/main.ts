import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environment = process.env.BOT_ENVIRONMENT;
  if (environment === 'prod') {
    app.enableCors({
      origin: ['https://tonauto.app', 'https://vuzcrmplus.store/'],
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    });
  } else {
    app.enableCors();
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
