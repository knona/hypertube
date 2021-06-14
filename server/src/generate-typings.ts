import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory: GraphQLDefinitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  customScalarTypeMapping: {
    DateTime: Date,
    Void: 'void',
    Upload: 'FileUpload',
    Language: 'Language',
    MovieGenre: 'MovieGenre',
    MovieSort: 'MovieSort',
    MovieSortOrder: 'MovieSortOrder'
  },
  additionalHeader: `
  import { FileUpload } from 'graphql-upload';
  import { MovieGenre } from './modules/movie/enums/movie-genre.enum';
  import { MovieSort } from './modules/movie/enums/movie-sort.enum';
  import { MovieSortOrder } from './modules/movie/enums/movie-sort-order.enum';
  import { Language } from './modules/movie/enums/language.enum';
  `
});
