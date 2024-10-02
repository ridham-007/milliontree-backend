// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { StripeModule } from './stripe/stripe.module';
import { EventModule } from './event/event.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TreeModule } from './tree/tree.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        global: true,
        signOptions: {
          expiresIn: '30d',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TreeModule,
    UsersModule,
    StripeModule,
    EventModule
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
