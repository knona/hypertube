import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DateTimeResolver, VoidResolver } from 'graphql-scalars';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';
import { languageResolver } from 'src/modules/movie/enums/language.enum';
import { movieGenreResolver } from 'src/modules/movie/enums/movie-genre.enum';
import { movieSortOrderResolver } from 'src/modules/movie/enums/movie-sort-order.enum';
import { movieSortResolver } from 'src/modules/movie/enums/movie-sort.enum';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      resolvers: {
        DateTime: DateTimeResolver,
        Void: VoidResolver,
        Upload: GraphQLUpload,
        Language: languageResolver,
        MovieGenre: movieGenreResolver,
        MovieSort: movieSortResolver,
        MovieSortOrder: movieSortOrderResolver
      },
      uploads: false,
      tracing: false,
      debug: false,
      formatError: ({ message, extensions }) => ({ message, extensions: { ...extensions, exception: undefined } })
    })
  ],
  exports: [GraphQLModule]
})
export class GQLModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(graphqlUploadExpress({ maxFiles: 1, maxFileSize: 10000000 })).forRoutes('graphql');
  }
}
