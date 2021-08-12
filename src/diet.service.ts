import cheerio from 'cheerio';
import DayJS from 'dayjs';
import got from 'got';
import { Injectable, NotFoundException } from '@nestjs/common';

const enum DietType {
  English = 0, // 양식코너
  Event = 1, // 천원의 아침
  Ramen = 2, // 라면코너
  SnackBar = 3, // 분식코너
  Bowl = 4, // 덮밥
  StaffNoraml = 5, // 교직원 중식
  StaffPremium = 6, // 교직원 일품식
}

const removeSpecialCharacters = (content: string): string => {
  return content
    .replace(/<br>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
};

export interface SocietyResultType {
  type: DietType;
  value: string;
}

export interface NavalResultType {
  lunch: string[];
  dinner: string[];
}

// 어울림관: https://www.kmou.ac.kr/coop/dv/dietView/selectDietDateView.do
// 해사대: http://badaro.kmou.ac.kr/food
@Injectable()
export class DietService {
  private readonly societyUrl =
    'https://www.kmou.ac.kr/coop/dv/dietView/selectDietDateView.do';
  private readonly navalBaseUrl = 'http://badaro.kmou.ac.kr';

  async getSocietyDietAsync(): Promise<SocietyResultType[]> {
    const results: SocietyResultType[] = [];
    const result = await got.get(this.societyUrl);
    const rawBody = cheerio.load(result.body);
    rawBody(
      'body > div > div > div > div > section > div > div > div > form > div > table > tbody > tr > td',
    ).each((index, element) => {
      results.push({
        type: index,
        value: removeSpecialCharacters(rawBody(element).html()),
      });
    });

    return results;
  }

  async getNavalDietAsync(): Promise<NavalResultType> {
    const results: string[] = [];
    let foundToday = false;
    const fisrtItemUrl = await this.getFirstItemPathFromNaval();
    const result = await got.get(fisrtItemUrl);
    const rawBody = cheerio.load(result.body);
    const todayMMddFormat = DayJS()
      .format('MM/DD')
      .replace('0', '')
      .replace('/0', '/');

    rawBody(
      'div > section > section > div > div > div > div > div > table > tbody > tr > td',
    ).each((index, element) => {
      if (foundToday && rawBody(element).html().startsWith('<strong>')) {
        return false;
      }
      if (foundToday) {
        results.push(rawBody(element).text());
      }
      if (rawBody(element).html().includes(todayMMddFormat)) {
        foundToday = true;
      }
    });
    if (!foundToday) {
      throw new NotFoundException(
        'DietService.getNavalDietAsync: There are no any diet',
      );
    }

    return {
      lunch: results.filter((_, index) => index % 2 === 0),
      dinner: results.filter((_, index) => index % 2 !== 0),
    };
  }

  async getFirstItemPathFromNaval(): Promise<string> {
    let resultUrl = '';
    const result = await got.get(`${this.navalBaseUrl}/food`);
    const rawBody = cheerio.load(result.body);
    rawBody(
      'div > section > section > div > div > div > table > tbody > tr > td > a',
    ).each((index, element) => {
      if (index === 0) {
        resultUrl = `${this.navalBaseUrl}${rawBody(element).attr('href')}`;
        return false;
      }
    });

    return resultUrl;
  }
}
