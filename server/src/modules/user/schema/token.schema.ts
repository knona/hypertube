import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TokenType } from '../token-type.enum';

export type TokenDocument = Token & Document & { id: string };

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
class Token {
  @Prop({ required: true })
  public token: string;

  @Prop({ required: true })
  public expiration: Date;

  @Prop({ type: String, enum: Object.values(TokenType), required: true })
  public type: TokenType;

  @Prop({ type: Object })
  public details?: Record<string, any>;

  @Prop()
  public createdAt: Date;
}

export const TokenSchema: MongooseSchema<TokenDocument> = SchemaFactory.createForClass(Token);
export { Token as TokenModel };
