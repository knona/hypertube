import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MovieStorageDocument = MovieStorage & Document & { id: string };

@Schema({ timestamps: true })
class MovieStorage {
  @Prop({ required: true })
  public path: string;

  @Prop({ required: true })
  public torrentId: string;

  @Prop({ required: true })
  public expiration: Date;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export const MovieStorageSchema: MongooseSchema<MovieStorageDocument> = SchemaFactory.createForClass(MovieStorage);
export { MovieStorage as MovieStorageModel };
