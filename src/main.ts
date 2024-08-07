import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['asdfasdf'] //this will be used to encrypt the content of the cookies
  }))
  app.useGlobalPipes(new ValidationPipe({whitelist: true})); // whitelist: true allows extra properties to be added to a request body without them being validated and causing a request processing error
  await app.listen(3000);
}
bootstrap();
