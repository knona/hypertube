import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { scheduleJob } from 'node-schedule';
import { LoginInput, RegisterInput, Token } from 'src/graphql';
import { everyDayAt3h } from 'src/shared/utils/cron.utils';
import { computeExpirationDate } from 'src/shared/utils/date.utils';
import {
  E_EMAIL_UNICITY,
  E_INVALID_CREDENTIALS,
  E_TOKEN_INVALID_OR_EXPIRED,
  E_USERNAME_UNICITY,
  E_USER_ALREADY_VERIFIED,
  E_USER_NOT_FOUND,
  E_USER_NOT_VERIFIED
} from 'src/shared/utils/errors.util';
import { uniqueString } from 'src/shared/utils/unique-string.util';
import { AppException } from '../../shared/exceptions/app-exception';
import { frontUrlUpdateEmail, frontUrlVerification } from '../email/config';
import { EmailService } from '../email/email.service';
import { TokenDocument, TokenModel } from '../user/schema/token.schema';
import { UserDocument, UserModel } from '../user/schema/user.schema';
import { TokenType } from '../user/token-type.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './jwt/jwt-payload';
import { expirationTime } from './jwt/jwt.config';

@Injectable()
export class AuthService implements OnModuleInit {
  public constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  public onModuleInit(): void {
    scheduleJob(everyDayAt3h, () => this.deleteExpiredTokens());
  }

  private generateToken(
    tokenType: TokenType,
    expirationDuration: string,
    details?: any
  ): Omit<TokenModel, 'id' | 'createdAt'> {
    return {
      token: uniqueString(),
      expiration: computeExpirationDate(expirationDuration),
      type: tokenType,
      details
    };
  }

  private generateJwtToken(payload: JwtPayload): Token {
    return {
      token: this.jwtService.sign(payload),
      expiration: computeExpirationDate(expirationTime)
    };
  }

  public async register(dto: RegisterInput): Promise<UserDocument> {
    const usernameAlreadyUsed: boolean = !!(await this.userModel.findOne({ username: dto.username }).exec());
    if (usernameAlreadyUsed) {
      throw new AppException('Username already used', { subCode: E_USERNAME_UNICITY });
    }

    const emailAlreadyUsed: boolean = !!(await this.userModel
      .findOne({ $or: [{ email: dto.email }, { 'tokens.email': dto.email }] })
      .exec());
    if (emailAlreadyUsed) {
      throw new AppException('Email already used', { subCode: E_EMAIL_UNICITY });
    }

    const hashedPassword: string = hashSync(dto.password, 12);
    const token: Omit<TokenModel, 'id' | 'createdAt'> = this.generateToken(TokenType.verifyEmail, '15m');
    const user: UserDocument = await this.userModel.create({ ...dto, password: hashedPassword, tokens: [token] });
    await this.emailService.verification(user.username, user.email, token.token, frontUrlVerification);
    return user;
  }

  public async login(dto: LoginInput): Promise<{ token: Token; user: UserDocument }> {
    const user: UserDocument = await this.userModel
      .findOne({
        $or: [{ username: dto.identifier }, { email: dto.identifier }]
      })
      .exec();
    if (!user) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    if (!(await compare(dto.password, user.password))) {
      throw new AppException('Invalid credentials', { subCode: E_INVALID_CREDENTIALS });
    }
    if (!user.isVerified) {
      throw new AppException('User account is not verified', { subCode: E_USER_NOT_VERIFIED });
    }
    return { token: this.generateJwtToken({ id: user.id }), user };
  }

  public async refresh(user: JwtPayload): Promise<Token> {
    const count: number = await this.userModel.findById(user.id).countDocuments();
    if (!count) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    return this.generateJwtToken(user);
  }

  public async verify(username: string, token: string): Promise<{ token: Token; user: UserDocument }> {
    let user: UserDocument = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    if (user.isVerified) {
      throw new AppException('User is already verified', { subCode: E_USER_ALREADY_VERIFIED });
    }
    const tokenFound: TokenDocument = user.tokens.find(tokenDocument => tokenDocument.token === token);
    if (!tokenFound || tokenFound.expiration.getTime() <= new Date().getTime()) {
      throw new AppException('The activation token is invalid or expired', { subCode: E_TOKEN_INVALID_OR_EXPIRED });
    }
    user = await this.userModel
      .findOneAndUpdate({ username }, { $set: { isVerified: true }, $pull: { tokens: { token } } }, { new: true })
      .exec();
    await this.emailService.verificationSuccess(user.username, user.email);
    return { token: this.generateJwtToken({ id: user.id }), user };
  }

  public async generateVerificationToken(email: string): Promise<void> {
    const user: UserDocument = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    if (user.isVerified) {
      throw new AppException('User is already verified', { subCode: E_USER_ALREADY_VERIFIED });
    }
    const token: Omit<TokenModel, 'id' | 'createdAt'> = this.generateToken(TokenType.verifyEmail, '15m');
    await this.userModel.updateOne({ email }, { $push: { tokens: token } }).exec();
    await this.emailService.verification(user.username, user.email, token.token, frontUrlVerification);
  }

  public async generateResetPasswordToken(email: string): Promise<void> {
    const user: UserDocument = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    const token: Omit<TokenModel, 'id' | 'createdAt'> = this.generateToken(TokenType.resetPassword, '15m');
    await this.userModel.updateOne({ email }, { $push: { tokens: token } }).exec();
    await this.emailService.resetPassword(user.username, user.email, token.token);
  }

  public async resetPassword({
    username,
    password,
    token
  }: ResetPasswordDto): Promise<{ token: Token; user: UserDocument }> {
    let user: UserDocument = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    const tokenFound: TokenDocument = user.tokens.find(tokenDocument => tokenDocument.token === token);
    if (!tokenFound || tokenFound.expiration.getTime() <= new Date().getTime()) {
      throw new AppException('The activation token is invalid or expired', { subCode: E_TOKEN_INVALID_OR_EXPIRED });
    }
    const hashedPassword: string = hashSync(password, 12);
    user = await this.userModel
      .findOneAndUpdate(
        { _id: user.id },
        { $set: { password: hashedPassword }, $pull: { tokens: { token } } },
        { new: true }
      )
      .exec();
    await this.emailService.resetPasswordSuccess(user.username, user.email);
    return { token: this.generateJwtToken({ id: user.id }), user };
  }

  public async generateEmailUpdateToken(email: string, { id }: JwtPayload): Promise<void> {
    const emailAlreadyUsed: boolean = !!(await this.userModel
      .findOne({ $or: [{ email }, { 'tokens.email': email }] })
      .exec());
    if (emailAlreadyUsed) {
      throw new AppException('Email already used', { subCode: E_EMAIL_UNICITY });
    }
    const token: Omit<TokenModel, 'id' | 'createdAt'> = this.generateToken(TokenType.updateEmail, '15m', { email });
    const user: UserDocument = await this.userModel
      .findByIdAndUpdate(id, { $push: { tokens: token } }, { new: true })
      .exec();
    await this.emailService.verification(user.username, email, token.token, frontUrlUpdateEmail);
  }

  public async updateEmail(username: string, token: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    const tokenFound: TokenDocument = user.tokens.find(tokenDocument => tokenDocument.token === token);
    if (!tokenFound || tokenFound.expiration.getTime() <= new Date().getTime()) {
      throw new AppException('The "update email token" is invalid or expired', { subCode: E_TOKEN_INVALID_OR_EXPIRED });
    }
    const email: string = tokenFound.details.email;
    const userUpdated: UserDocument = await this.userModel
      .findByIdAndUpdate(user.id, { $set: { email }, $pull: { tokens: { token } } }, { new: true })
      .exec();
    await this.emailService.verificationSuccess(user.username, email);
    return userUpdated;
  }

  public async deleteExpiredTokens(): Promise<void> {
    await this.userModel.updateMany({}, { $pull: { tokens: { expiration: { $lte: new Date() } } } });
  }
}
