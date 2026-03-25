import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Media } from '../../shared/models/media.model';
import { environment } from '../../../environments/environment';

export interface UpdateMediaDto {
  title?: string;
  description?: string;
  keywords?: string[];
  topics?: string[];
  price?: number;
}

@Injectable({ providedIn: 'root' })
export class MediaApiService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getMyMedia(): Observable<Media[]> {
    return this.api.get<Media[]>('/media/me');
  }

  upload(formData: FormData): Observable<Media> {
    return this.http.post<Media>(`${this.baseUrl}/media/upload`, formData, {
      withCredentials: true,
    });
  }

  updateMedia(id: string, dto: UpdateMediaDto): Observable<Media> {
    return this.api.put<Media>(`/media/${id}`, dto);
  }

  publishMedia(id: string): Observable<Media> {
    return this.api.put<Media>(`/media/${id}/publish`, {});
  }

  unpublishMedia(id: string): Observable<Media> {
    return this.api.put<Media>(`/media/${id}/unpublish`, {});
  }

  deleteMedia(id: string): Observable<void> {
    return this.api.delete<void>(`/media/${id}`);
  }
}
