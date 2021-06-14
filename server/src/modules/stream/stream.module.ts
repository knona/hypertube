import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieStorageModel, MovieStorageSchema } from './movie-storage.schema';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MovieStorageModel.name, schema: MovieStorageSchema }])],
  controllers: [StreamController],
  providers: [StreamService],
  exports: [StreamService]
})
export class StreamModule {}
