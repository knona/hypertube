import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hashSync } from 'bcrypt';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import { FileUpload } from 'graphql-upload';
import { FilterQuery, Model } from 'mongoose';
import sharp from 'sharp';
import { File } from 'src/shared/interfaces/file.interface';
import { Projection } from 'src/shared/types/projection.type';
import {
  E_INVALID_CREDENTIALS,
  E_INVALID_FILE_EXTENSION,
  E_INVALID_FILE_MIMETYPE,
  E_USERNAME_UNICITY,
  E_USER_NOT_FOUND
} from 'src/shared/utils/errors.util';
import { getFileExtension } from 'src/shared/utils/file-extension.utils';
import { pipeline } from 'stream/promises';
import { v4 as uuidv4 } from 'uuid';
import { AppException } from '../../shared/exceptions/app-exception';
import { JwtPayload } from '../auth/jwt/jwt-payload';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, UserModel } from './schema/user.schema';

@Injectable()
export class UserService {
  public constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>) {}

  public findMany(projection: Projection<UserModel> = {}): Promise<UserDocument[]> {
    return this.userModel.find().select(projection).exec();
  }

  public async findOne(
    filter: FilterQuery<UserDocument>,
    projection: Projection<UserModel> = {}
  ): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne(filter).select(projection).populate('comments').exec();
    if (!user) {
      throw new AppException('User not found', { subCode: E_USER_NOT_FOUND });
    }
    return user;
  }

  public async updatePassword(oldPassword: string, newPassword: string, { id }: JwtPayload): Promise<void> {
    const user: UserDocument = await this.userModel.findOne({ _id: id }).exec();
    if (!(await compare(oldPassword, user.password))) {
      throw new AppException('Invalid credentials', { subCode: E_INVALID_CREDENTIALS });
    }
    const hashedPassword: string = hashSync(newPassword, 12);
    await this.userModel.updateOne({ _id: id }, { $set: { password: hashedPassword } }).exec();
  }

  public async updateUsername(username: string, { id }: JwtPayload): Promise<UserDocument> {
    const usernameAlreadyUsed: boolean = !!(await this.userModel.findOne({ username }).exec());
    if (usernameAlreadyUsed) {
      throw new AppException('Username already used', { subCode: E_USERNAME_UNICITY });
    }
    return this.userModel.findByIdAndUpdate(id, { $set: { username } }, { new: true }).exec();
  }

  public updateUser(dto: UpdateUserDto, { id }: JwtPayload): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
  }

  private imageValidation(mimetype: string, extension: string): void {
    const validExtensions: string[] = ['png', 'jpeg', 'jpg'];
    if (!validExtensions.includes(extension)) {
      throw new AppException(`Invalid file extension (${validExtensions.join(' / ')})`, {
        subCode: E_INVALID_FILE_EXTENSION
      });
    }
    const validMimetypes: string[] = ['image/jpeg', 'image/png'];
    if (!validMimetypes.includes(mimetype)) {
      throw new AppException(`Invalid mimetype (${validMimetypes.join(' / ')})`, { subCode: E_INVALID_FILE_MIMETYPE });
    }
  }

  private async storeImage(image: File, username: string): Promise<string> {
    const { stream, mimetype, extension } = image;
    this.imageValidation(mimetype, extension);
    const path: string = `images/${username}-${uuidv4()}.png`;
    await pipeline(stream, sharp().resize(300, 300).png({ quality: 90 }), createWriteStream(`public/${path}`));
    return path;
  }

  private deleteImage(path: string): void {
    const filePath: string = `public/${path}`;
    if (!existsSync(filePath)) {
      return;
    }
    unlinkSync(filePath);
  }

  public async upsertProfilPicture(image: File, user: UserDocument): Promise<UserDocument> {
    const path: string = await this.storeImage(image, user.username);
    if (user.pictureUrl) {
      this.deleteImage(user.pictureUrl);
    }
    return this.userModel.findByIdAndUpdate(user.id, { $set: { pictureUrl: path } }, { new: true });
  }

  public async changeProfilPicture(image: FileUpload, userId: string): Promise<UserDocument> {
    const file: File = {
      mimetype: image.mimetype,
      extension: getFileExtension(image.filename),
      stream: image.createReadStream()
    };
    const user: UserDocument = await this.userModel.findById(userId);
    return this.upsertProfilPicture(file, user);
  }
}
