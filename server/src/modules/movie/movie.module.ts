import { Module } from '@nestjs/common';
import { CommentModule } from '../comment/comment.module';
import { MovieAttributeModule } from '../movie-attribute/movie-attribute.module';
import { MovieResolver } from './movie.resolver';
import { TmdbYts } from './tmdb-yts-provider/tmdb-yts.provider';

@Module({
  imports: [CommentModule, MovieAttributeModule],
  providers: [MovieResolver, { provide: 'MovieProvider', useClass: TmdbYts }],
  exports: []
})
export class MovieModule {}
