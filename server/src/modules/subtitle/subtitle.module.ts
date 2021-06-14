import { Module } from '@nestjs/common';
import { SubtitleController } from './subtitle.controller';
import { YifySubtitlesService } from './providers/yify/yify-subtitles.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SubtitleController],
  providers: [{ provide: 'SubtitleProvider', useClass: YifySubtitlesService }]
})
export class SubtitleModule {}
