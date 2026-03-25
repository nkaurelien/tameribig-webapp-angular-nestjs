import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User, SocialLinks, Address } from '../../shared/models/user.model';

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string;
  about?: string;
  occupation?: string;
  companyName?: string;
  socialLinks?: Partial<SocialLinks>;
  address?: Partial<Address>;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly api = inject(ApiService);

  getMe(): Observable<User> {
    return this.api.get<User>('/users/me');
  }

  updateMe(dto: UpdateUserDto): Observable<User> {
    return this.api.put<User>('/users/me', dto);
  }
}
