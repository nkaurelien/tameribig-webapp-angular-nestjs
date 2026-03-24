import { MaybeDocument } from 'nano';

export interface Topic extends MaybeDocument {
  type: 'topic';
  name: string;
  slug: string;
  picture?: string;
  miniature?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}
