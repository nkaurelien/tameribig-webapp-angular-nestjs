import { MaybeDocument } from 'nano';

export interface SocialLinks {
  facebook?: string;
  youtube?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  dribbble?: string;
}

export interface Address {
  street?: string;
  locality?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
}

export interface ContentMetrics {
  images?: number;
  creas?: number;
  audios?: number;
  videos?: number;
  illustrations?: number;
  users?: number;
}

export interface User extends MaybeDocument {
  type: 'user';
  supertokensId: string;
  email: string;
  username: string;
  fullname?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  photoUrl?: string;
  about?: string;
  occupation?: string;
  companyName?: string;
  roles: string[];
  permissions: string[];
  socialLinks?: SocialLinks;
  address?: Address;
  views?: ContentMetrics;
  upvotes?: ContentMetrics;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface PublicUserProfile {
  _id?: string;
  username: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  about?: string;
  occupation?: string;
  companyName?: string;
  socialLinks?: SocialLinks;
}
