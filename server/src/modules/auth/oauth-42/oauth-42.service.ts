import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import FileType, { FileTypeResult } from 'file-type';
import got, { Got } from 'got/dist/source';
import { Model } from 'mongoose';
import { Token } from 'src/graphql';
import { AppException } from 'src/shared/exceptions/app-exception';
import { File } from 'src/shared/interfaces/file.interface';
import { computeExpirationDate } from 'src/shared/utils/date.utils';
import { E_EMAIL_UNICITY, E_OAUTH_42 } from 'src/shared/utils/errors.util';
import { uniqueString } from 'src/shared/utils/unique-string.util';
import { PassThrough, Readable } from 'stream';
import { UserDocument, UserModel } from '../../user/schema/user.schema';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../jwt/jwt-payload';
import { expirationTime } from '../jwt/jwt.config';
import { API42MeResponse, API42OAuthParams, API42OAuthResponse, UserInfos } from './oauth-42.types';

@Injectable()
export class OAuth42Service {
  private clientId: string = 'c4d89c345383ed66a47fb6ad18c82d8d50f69a088c84a52250b9846dfb64575f';
  private clientSecret: string = '1b8535278e80e5cc5ad2b8a5f32072afdc4504b75efc547a004a9bb0a52545d8';
  private client: Got = got.extend({ responseType: 'json' });

  public constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  private generateJwtToken(payload: JwtPayload): Token {
    return {
      token: this.jwtService.sign(payload),
      expiration: computeExpirationDate(expirationTime)
    };
  }

  private async getOAuthToken(code: string): Promise<string> {
    const params: API42OAuthParams = {
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: 'http://localhost:5000/auth/42',
      code
    };
    let res: API42OAuthResponse;
    try {
      res = await this.client.post<API42OAuthResponse>('https://api.intra.42.fr/oauth/token', {
        json: params,
        resolveBodyOnly: true
      });
    } catch (error) {
      throw new AppException('Failed to login with 42 oauth', { subCode: E_OAUTH_42 });
    }
    return res.access_token;
  }

  private async getInfos(token: string): Promise<UserInfos> {
    let res: API42MeResponse;
    try {
      res = await this.client.get<API42MeResponse>('https://api.intra.42.fr/v2/me', {
        responseType: 'json',
        resolveBodyOnly: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      throw new AppException('Failed to login with 42 oauth', { subCode: E_OAUTH_42 });
    }
    return {
      id: res.id,
      email: res.email,
      firstName: res.first_name,
      lastName: res.last_name,
      login: res.login,
      pictureUrl: res.image_url
    };
  }

  public async addProfilPicture(pictureUrl: string, user: UserDocument): Promise<UserDocument> {
    try {
      const stream: Readable = got.stream(pictureUrl);
      const cloneStream: Readable = stream.pipe(new PassThrough());
      const { mime, ext }: FileTypeResult = await FileType.fromStream(stream);
      const file: File = { mimetype: mime, extension: ext, stream: cloneStream };
      return this.userService.upsertProfilPicture(file, user);
    } catch (_err) {
      return user;
    }
  }

  public async createUserFromInfos(userInfos: UserInfos): Promise<UserDocument> {
    let username: string = userInfos.login;
    const usernameAlreadyUsed: boolean = !!(await this.userModel.findOne({ username }).exec());
    if (usernameAlreadyUsed) {
      username = username + '_' + uniqueString(10);
    }
    const emailAlreadyUsed: boolean = !!(await this.userModel
      .findOne({ $or: [{ email: userInfos.email }, { 'tokens.email': userInfos.email }] })
      .exec());
    if (emailAlreadyUsed) {
      throw new AppException('Email already used', { subCode: E_EMAIL_UNICITY });
    }
    const password: string = hashSync(uniqueString(), 12);
    const user: UserDocument = await this.userModel.create({
      username,
      email: userInfos.email,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      password,
      id42: userInfos.id
    });
    return this.addProfilPicture(userInfos.pictureUrl, user);
  }

  public async login(code: string): Promise<{ token: Token; user: UserDocument }> {
    const oauthToken: string = await this.getOAuthToken(code);
    const userInfos: UserInfos = await this.getInfos(oauthToken);
    let user: UserDocument = await this.userModel.findOne({ id42: userInfos.id });
    if (!user) {
      user = await this.createUserFromInfos(userInfos);
    }
    return { token: this.generateJwtToken({ id: user.id }), user };
  }
}
