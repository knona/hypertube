import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TmdbYts } from '../movie/tmdb-yts-provider/tmdb-yts.provider';
import { MovieAttributeModel, MovieAttributeSchema } from './movie-attribute.schema';
import { MovieAttributeService } from './movie-attribute.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MovieAttributeModel.name, schema: MovieAttributeSchema }])],
  providers: [MovieAttributeService, { provide: 'MovieProvider', useClass: TmdbYts }],
  exports: [MovieAttributeService]
})
export class MovieAttributeModule {}
