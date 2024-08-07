import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Registering the cookie-session middleware and the Validation Pipe from main.ts will
  //NOT make them available for our e2e tests
  //Register in the AppModule instead

  // Using cookie-session middleware
  // app.use(cookieSession({
  //   keys: ['asdfasdf'] //this will be used to encrypt the content of the cookies
  // }))
  // Registering a Validation Pipe globally for the entirety of the service
  // app.useGlobalPipes(new ValidationPipe({whitelist: true})); // whitelist: true allows extra properties to be added to a request body without them being validated and causing a request processing error
  
  
  await app.listen(3000);
}
bootstrap();
