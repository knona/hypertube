import { Controller, Get, HttpCode, HttpException, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryParamsToken } from '../auth/alternative-auth.decorator';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  public constructor(private readonly streamService: StreamService) {}

  @Get('')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @QueryParamsToken()
  public stream(@Req() req: Request, @Res() res: Response, @Query('hash') hash: string): Promise<void> {
    if (!hash) {
      throw new HttpException('A hash must be provided', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return this.streamService.stream(req, res, hash);
  }
}
