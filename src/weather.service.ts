import cheerio from 'cheerio';
import got from 'got';
import { Injectable } from '@nestjs/common';

export interface WeatherNowResult {
  status: string;
  temparature: string;
  windSpeed: string;
  humidity: string;
}

@Injectable()
export class WeatherService {
  private readonly weatherUrl =
    'https://www.tomorrow.io/weather/ko/KR/26/Yeongdo-gu/065552/hourly';

  async getCurrentWeatherAsync(): Promise<WeatherNowResult> {
    const result = await got.get(this.weatherUrl);
    const rawBody = cheerio.load(result.body);

    return {
      status: rawBody('._1EZPSJ').eq(0).text(),
      temparature: rawBody('._1yysRb').eq(0).text(),
      windSpeed: rawBody('._2HcU4U').eq(0).text().replace('바람 ', ''),
      humidity: rawBody('._3uRmiA').eq(0).text(),
    };
  }
}
