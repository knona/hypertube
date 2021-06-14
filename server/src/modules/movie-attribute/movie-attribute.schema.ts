import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from 'src/modules/user/schema/user.schema';
import { MovieAttributeType } from './movie-attribute-type.enum';

export type MovieAttributeDocument = MovieAttribute & Document & { id: string };

@Schema({ timestamps: true })
class MovieAttribute {
  @Prop({ required: true })
  public tmdbId: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  public user: UserDocument;

  @Prop({ required: true, type: String, enum: Object.values(MovieAttributeType) })
  public type: MovieAttributeType;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export const MovieAttributeSchema: MongooseSchema<MovieAttributeDocument> =
  SchemaFactory.createForClass(MovieAttribute);
export { MovieAttribute as MovieAttributeModel };
