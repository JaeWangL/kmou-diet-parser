import cheerio from 'cheerio';
import got from 'got';
import { Injectable } from '@nestjs/common';

const enum DietType {
  English = 0, // 양식코너
  Event = 1, // 천원의 아침
  Ramen = 2, // 라면코너
  SnackBar = 3, // 분식코너
  Bowl = 4, // 덮밥
}

const removeSpecialCharacters = (content: string): string => {
  return content
    .replace(/<br>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
};

export interface ResultType {
  type: DietType;
  value: string;
}

// 어울림관: https://www.kmou.ac.kr/coop/dv/dietView/selectDietDateView.do
@Injectable()
export class DietService {
  private readonly url =
    'https://www.kmou.ac.kr/coop/dv/dietView/selectDietDateView.do';

  async getSocietyDiet(): Promise<void> {
    const results: ResultType[] = [];
    const result = await got.get(this.url);
    const rawBody = cheerio.load(result.body);
    rawBody(
      'body > div > div > div > div > section > div > div > div > form > div > table > tbody > tr > td',
    ).each((index, element) => {
      results.push({
        type: index,
        value: removeSpecialCharacters(rawBody(element).html()),
      });
    });

    console.log(results);
  }
}
