import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message ?? 'error.user_not_found');
  }
}
