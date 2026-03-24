import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicMedia } from '../../models/media.model';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <!-- Thumbnail -->
      <div class="relative aspect-square overflow-hidden bg-gray-100">
        <img
          [src]="media.urls.thumbnail || 'images/default.jpg'"
          [alt]="media.title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          (error)="onImageError($event)"
        />
        <!-- Type badge -->
        <span
          class="absolute top-2 right-2 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
          [class]="typeBadgeClass"
        >
          {{ typeLabel }}
        </span>
      </div>

      <!-- Info -->
      <div class="p-3">
        <h3 class="text-sm font-medium text-gray-900 truncate">
          {{ media.title }}
        </h3>
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-gray-500">{{
            media.author.displayName || 'Anonyme'
          }}</span>
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {{ media.metrics.views }}
            </span>
            <span class="flex items-center gap-1">
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {{ media.metrics.upvotes }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MediaCardComponent {
  @Input({ required: true }) media!: PublicMedia;

  get typeLabel(): string {
    switch (this.media.mediaType) {
      case 'image':
        return 'Photo';
      case 'video':
        return 'Vidéo';
      case 'audio':
        return 'Audio';
      default:
        return this.media.mediaType;
    }
  }

  get typeBadgeClass(): string {
    switch (this.media.mediaType) {
      case 'image':
        return 'bg-orange-100 text-orange-700';
      case 'video':
        return 'bg-purple-100 text-purple-700';
      case 'audio':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'images/default.jpg';
  }
}
