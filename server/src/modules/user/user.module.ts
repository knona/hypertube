import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from '../comment/comment.module';
import { MovieAttributeModule } from '../movie-attribute/movie-attribute.module';
import { UserModel, UserSchema } from './schema/user.schema';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    CommentModule,
    MovieAttributeModule
  ],
  providers: [UserService, UserResolver],
  exports: [UserService, MongooseModule]
})
export class UserModule {}
