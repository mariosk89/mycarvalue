import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfig } from './config/typeorm.config';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    
    //Registering the ConfigModule that will read the variables from the .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),

    UsersModule, 
    ReportsModule, 

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),

    // Configuration when not using ormconfig.js
    // TypeOrmModule.forRootAsync({
    //   //ConfigService exposes the variables read by the ConfigModule
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'), // Getting the name of the database from the ConfigService
    //       entities: [User, Report], // Registering the various entities
    //       synchronize: true         // Only use in dev environment - auto run and apply migration based on changes in the entities
    //     }
    //   }
    // })
    //Configuring TypeOrm without the ConfigService
    // TypeOrmModule.forRoot({
    // type: 'sqlite',
    // database: 'db.sqlite',  
    // entities: [User, Report], 
    // synchronize: true       
    // })
],
  controllers: [AppController],

  providers: [
    AppService,
    { //Setting up a global pipe
      provide: APP_PIPE, 
      useValue: new ValidationPipe({whitelist: true})
    }
  ],
})

export class AppModule {

  constructor(private configService: ConfigService){

  }

  //Globally configuring middleware
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(
      cookieSession(
        {
          keys: [this.configService.get('COOKIE_KEY')]
          //keys: ['asdfasdf'] //hardcoded 'asdfasdf' will be used to encrypt the content of the cookies. need to get from the configuration instead
        }
      ) 
    ) 
    .forRoutes('*'); // Apply on all routes (*) (Globally)
  }
}
