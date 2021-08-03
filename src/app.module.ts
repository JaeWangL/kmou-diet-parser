import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DietService } from './diet.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DietService],
})
export class AppModule {}
