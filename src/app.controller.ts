import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DietService, SocietyResultType } from './diet.service';

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

  @Get('diet/society')
  async getDietSociety(): Promise<SocietyResultType[]> {
    const res = await this.dietSvc.getSocietyDietAsync();

    return res;
  }

  @Get('diet/naval')
  async getDietUniv(): Promise<[string[], string[]]> {
    const res = await this.dietSvc.getNavalDietAsync();

    return res;
  }
}
