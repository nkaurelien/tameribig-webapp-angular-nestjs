import { MaybeDocument } from 'nano';

export interface NotificationData {
  title?: string;
  body?: string;
  imageUrl?: string;
  actionUrl?: string;
  [key: string]: unknown;
}

export interface Notification extends MaybeDocument {
  type: 'notification';
  notifiableId: string;
  notifiableType: string;
  notificationType: string;
  data: NotificationData;
  readAt?: string;
  createdAt: string;
}
