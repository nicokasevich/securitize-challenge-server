import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsModule } from './wallets/wallets.module';
import { MongooseModule } from '@nestjs/mongoose';
import appenv from './config/appenv';

@Module({
  imports: [MongooseModule.forRoot(appenv.MONGO_URL), WalletsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
