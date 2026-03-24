export interface Topic {
  _id?: string;
  type: 'topic';
  name: string;
  slug: string;
  picture?: string;
  miniature?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}
