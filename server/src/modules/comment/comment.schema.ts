import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserDocument } from 'src/modules/user/schema/user.schema';

export type CommentDocument = Comment & Document & { id: string };

@Schema({ timestamps: true })
class Comment {
  @Prop({ required: true })
  public tmdbId: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  public author: UserDocument;

  @Prop({ required: true })
  public content: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export const CommentSchema: MongooseSchema<CommentDocument> = SchemaFactory.createForClass(Comment);
export { Comment as CommentModel };
