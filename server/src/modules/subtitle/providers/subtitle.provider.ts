import { Language } from 'src/modules/movie/enums/language.enum';
import { Writable } from 'stream';

export interface SubtitleProvider {
  getSubtitle: (imdbId: string, language: Language) => Promise<Writable>;
}
