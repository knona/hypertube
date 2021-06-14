import type { User } from './User';

export interface Comment {
  id: string;
  tmdbId: number;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
