import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DietService } from './diet.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dietSvc: DietService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('diet/univ')
  async getDietUniv(): Promise<string> {
    await this.dietSvc.getSocietyDiet();

    return '';
  }
}
