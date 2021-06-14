import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import { Auth, people_v1 } from 'googleapis';
import { Model } from 'mongoose';
import { Token } from 'src/graphql';
import { AppException } from 'src/shared/exceptions/app-exception';
import { computeExpirationDate } from 'src/shared/utils/date.utils';
import { E_EMAIL_UNICITY, E_OAUTH_GOOGLE } from 'src/shared/utils/errors.util';
import { removeNonAlphaNumericChars } from 'src/shared/utils/string.utils';
import { uniqueString } from 'src/shared/utils/unique-string.util';
import { UserDocument, UserModel } from '../../user/schema/user.schema';
import { JwtPayload } from '../jwt/jwt-payload';
import { expirationTime } from '../jwt/jwt.config';

interface UserInfos {
  idGoogle: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class OAuthGoogleService {
  public constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  private generateJwtToken(payload: JwtPayload): Token {
    return {
      token: this.jwtService.sign(payload),
      expiration: computeExpirationDate(expirationTime)
    };
  }

  private async getInfos(code: string): Promise<UserInfos> {
    try {
      const oauth2Client: Auth.OAuth2Client = new Auth.OAuth2Client({
        clientId: '1038106595102-5a932i8kr9rfuf28o5tm1frq9la91v0m.apps.googleusercontent.com',
        clientSecret: 'Z2I2GqlW5G7t0KYLT0tDLXK2',
        redirectUri: 'http://localhost:5000'
      });
      const { tokens } = await oauth2Client.getToken(code);
      const people: people_v1.People = new people_v1.People({ auth: '' });
      const { data } = await people.people.get({
        personFields: 'names,emailAddresses',
        resourceName: 'people/me',
        access_token: tokens.access_token
      });
      return {
        idGoogle: +data.resourceName.split('/')[1],
        email: data.emailAddresses[0].value,
        firstName: data.names[0].givenName,
        lastName: data.names[0].familyName
      };
    } catch (_error) {
      throw new AppException('Failed to login with Google oauth', { subCode: E_OAUTH_GOOGLE });
    }
  }

  public async createUserFromInfos(userInfos: UserInfos): Promise<UserDocument> {
    const username: string = removeNonAlphaNumericChars(userInfos.email.split('@')[0]) + '_' + uniqueString(10);
    const emailAlreadyUsed: boolean = !!(await this.userModel
      .findOne({ $or: [{ email: userInfos.email }, { 'tokens.email': userInfos.email }] })
      .exec());
    if (emailAlreadyUsed) {
      throw new AppException('Email already used', { subCode: E_EMAIL_UNICITY });
    }
    const password: string = hashSync(uniqueString(), 12);
    return this.userModel.create({ ...userInfos, username, password });
  }

  public async login(code: string): Promise<{ token: Token; user: UserDocument }> {
    const userInfos: UserInfos = await this.getInfos(code);
    let user: UserDocument = await this.userModel.findOne({ idGoogle: userInfos.idGoogle });
    if (!user) {
      user = await this.createUserFromInfos(userInfos);
    }
    return { token: this.generateJwtToken({ id: user.id }), user };
  }
}
