import type { Comment } from '../../Models/Comment';
import { CREATE_COMMENT } from '../../Models/Server/Requests/CreateComment.request';
import { DELETE_COMMENT } from '../../Models/Server/Requests/DeleteComment.request';
import type { CreateCommentResponse } from '../../Models/Server/Responses/CreateCommentResponse';
import { Request } from '../Request/Request';
import { token } from '../Store/Token/TokenStore';

async function createComment(tmdbId: number, content: string): Promise<Comment> {
  const request: Request = new Request(CREATE_COMMENT, { tmdbId: tmdbId, content: content });
  request.token = token.getString();
  const response: CreateCommentResponse = await request.perform<CreateCommentResponse>();
  return response.createComment;
}

async function deleteComment(id: string): Promise<void> {
  const request: Request = new Request(DELETE_COMMENT, { id: id });
  request.token = token.getString();
  await request.perform();
}

export default {
  createComment,
  deleteComment
};
