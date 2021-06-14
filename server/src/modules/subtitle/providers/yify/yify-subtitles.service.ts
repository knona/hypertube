import { Injectable, NotFoundException } from '@nestjs/common';
import * as cheerio from 'cheerio';
import got from 'got/dist/source';
import pump from 'pump';
import { Writable } from 'stream';
import { parse, stringify } from 'subtitle';
import unzipper from 'unzipper';
import { Language } from '../../../movie/enums/language.enum';
import { SubtitleProvider } from '../subtitle.provider';
import { yifyLanguagesMap } from './yify-languages-map';

type YifyResponse = any;

interface YifySubtitle {
  id: number;
  rating: number;
  release: string;
  hearingImpaired: boolean;
  lang: string;
  langName: string;
  url: string;
}

@Injectable()
export class YifySubtitlesService implements SubtitleProvider {
  private uri: string = 'https://yifysubtitles.org/movie-imdb';
  private downloadUri: string = 'https://yifysubtitles.org/';

  private async scrape(imdbId: string): Promise<YifySubtitle[]> {
    imdbId = 'tt' + imdbId.replace('tt', '');

    const body: YifyResponse = await got.get<YifyResponse>(`${this.uri}/${imdbId}`, { resolveBodyOnly: true });
    const $: cheerio.Root = cheerio.load(body);
    return $('tbody tr')
      .map((_index, el) => {
        const $el: cheerio.Cheerio = $(el);
        const language: string = $el.find('.flag-cell .sub-lang').text();

        return {
          id: +$el.attr('data-id'),
          rating: +$el.find('.rating-cell').text(),
          release: $el.find('.text-muted').parent().text().slice(9),
          hearingImpaired: $el.find('.hi-subtitle')[0] ? true : false,
          lang: yifyLanguagesMap[language.toLowerCase()],
          langName: language,
          url:
            this.downloadUri + $el.find('td:nth-child(3) > a').attr('href').replace('subtitles/', 'subtitle/') + '.zip'
        };
      })
      .get();
  }

  private rearrange(subs: YifySubtitle[] = []): { [lang: string]: YifySubtitle[] } {
    const subtitles: { [lang: string]: YifySubtitle[] } = {};

    subs
      .filter(sub => sub.hearingImpaired === false)
      .sort((a, b) => b.rating - a.rating)
      .forEach(sub => {
        const lang: string = sub.lang;
        if (!subtitles[lang]) {
          subtitles[lang] = [];
        }
        subtitles[lang].push(sub);
      });
    return subtitles;
  }

  private async findSubtitles(imdbId: string): Promise<{ [lang: string]: YifySubtitle[] }> {
    return this.scrape(imdbId).then(this.rearrange);
  }

  public async getSubtitle(imdbId: string, language: Language): Promise<Writable> {
    const subtitles: { [lang: string]: YifySubtitle[] } = await this.findSubtitles(imdbId);

    const subs: YifySubtitle[] = subtitles[language];
    if (!subs) {
      throw new NotFoundException(`Subtitles do not exist for movie: Imdb Id: ${imdbId} / Language: ${language}`);
    }
    return pump(
      got.stream(subs[0].url),
      unzipper.ParseOne(/\.srt$/),
      parse(),
      stringify({ format: 'WebVTT' })
    ) as Writable;
  }
}
