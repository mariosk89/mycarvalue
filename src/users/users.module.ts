import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService, 
    //Globally Scoped Interceptor - will apply to the entirety of the service
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass:CurrentUserInterceptor
    // }
    // replaced interceptor with the CurrentUserMiddleware
    ]
})
export class UsersModule {
  //Globally configuring middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*'); // Apply on all routes (*) (Globally)
  }
}
