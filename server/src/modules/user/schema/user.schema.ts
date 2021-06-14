import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TokenDocument, TokenSchema } from './token.schema';

export type UserDocument = User & Document & { id: string };

@Schema({ timestamps: true })
class User {
  @Prop({ required: true, unique: true })
  public username: string;

  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public password: string;

  @Prop({ required: true })
  public firstName: string;

  @Prop({ required: true })
  public lastName: string;

  @Prop()
  public pictureUrl: string;

  @Prop()
  public id42: number;

  @Prop()
  public idGoogle: number;

  @Prop({ required: true, default: false })
  public isVerified: boolean;

  @Prop({ type: [TokenSchema] })
  public tokens: TokenDocument[];

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export const UserSchema: MongooseSchema<UserDocument> = SchemaFactory.createForClass(User);
export { User as UserModel };
