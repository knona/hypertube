import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppException } from 'src/shared/exceptions/app-exception';
import { CommentDocument, CommentModel } from './comment.schema';

@Injectable()
export class CommentService {
  public constructor(@InjectModel(CommentModel.name) private readonly commentModel: Model<CommentDocument>) {}

  public findManyByMovie(tmdbId: number): Promise<CommentDocument[]> {
    return this.commentModel.find({ tmdbId }).populate('author').exec();
  }

  public findManyByAuthor(userId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ author: userId as any })
      .populate('author')
      .exec();
  }

  public async create(authorId: string, tmdbId: number, content: string): Promise<CommentDocument> {
    const comment: CommentDocument = await this.commentModel.create({ author: authorId, tmdbId, content });
    return this.commentModel.findById(comment.id).populate('author');
  }

  public async delete(authorId: string, commentId: string): Promise<void> {
    const comment: CommentDocument = await this.commentModel.findById(commentId);
    if (!comment) {
      throw new AppException('Comment not found');
    }
    if (comment.author.toString() !== authorId) {
      throw new AppException('User is not the author of the comment');
    }
    await this.commentModel.deleteOne({ _id: commentId });
  }
}
