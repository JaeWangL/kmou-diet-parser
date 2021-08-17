import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  DietService,
  NavalResultType,
  SocietyResultType,
} from './diet.service';
import { WeatherNowResult, WeatherService } from './weather.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dietSvc: DietService,
    private readonly weatherSvc: WeatherService,
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
  async getDietUniv(): Promise<NavalResultType> {
    const res = await this.dietSvc.getNavalDietAsync();

    return res;
  }

  @Get('weather/now')
  async getCurrentWeather(): Promise<WeatherNowResult> {
    const res = await this.weatherSvc.getCurrentWeatherAsync();

    return res;
  }
}
