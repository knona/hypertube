import { Controller, Get, Header, HttpStatus, Inject, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import pump from 'pump';
import { Writable } from 'stream';
import { QueryParamsToken } from '../auth/alternative-auth.decorator';
import { Language } from '../movie/enums/language.enum';
import { SubtitleProvider } from './providers/subtitle.provider';

@Controller('subtitle')
export class SubtitleController {
  public constructor(@Inject('SubtitleProvider') private readonly subtitleService: SubtitleProvider) {}

  @Get('')
  @Header('Content-type', 'text/vtt')
  @QueryParamsToken()
  public async stream1(
    @Res() res: Response,
    @Query('imdbId') imdbId: string,
    @Query('language') language: Language
  ): Promise<void> {
    const stream: Writable = await this.subtitleService.getSubtitle(imdbId, language);
    pump(stream, res, () => res.status(HttpStatus.NOT_FOUND).send());
  }
}
