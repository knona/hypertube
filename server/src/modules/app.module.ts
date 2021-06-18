import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import { exceptionFactory } from 'src/shared/utils/exception-factory.util';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { GQLModule } from './gql.module';
import { MovieModule } from './movie/movie.module';
import { StreamModule } from './stream/stream.module';
import { SubtitleModule } from './subtitle/subtitle.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GQLModule,
    MongooseModule.forRoot('mongodb://localhost/hypertube', { useCreateIndex: true, useFindAndModify: false }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', '..', 'public'), renderPath: '/images' }),
    MovieModule,
    UserModule,
    AuthModule,
    StreamModule,
    SubtitleModule,
    CommentModule
  ],
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe({ exceptionFactory }) }]
})
export class AppModule {}
