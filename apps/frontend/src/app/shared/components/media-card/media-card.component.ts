import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicMedia } from '../../models/media.model';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a
      [routerLink]="['/media', media._id]"
      class="card bg-base-100 border border-base-300 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 no-underline group"
    >
      <!-- Thumbnail -->
      <figure class="relative aspect-square overflow-hidden bg-base-200">
        <img
          [src]="media.urls.thumbnail || 'images/default.jpg'"
          [alt]="media.title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          (error)="onImageError($event)"
        />
        <span
          class="badge badge-sm absolute top-2 right-2 capitalize"
          [class]="typeBadgeClass"
        >
          {{ typeLabel }}
        </span>
        @if (media.price && media.price > 0) {
          <span class="badge badge-sm badge-neutral absolute top-2 left-2">
            {{ media.price }} FCFA
          </span>
        }
      </figure>

      <!-- Info -->
      <div class="card-body p-3">
        <h3 class="text-sm font-medium truncate">
          {{ media.title }}
        </h3>
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs text-base-content/50">{{
            media.author.displayName || 'Anonyme'
          }}</span>
          <div class="flex items-center gap-3 text-xs text-base-content/40">
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
    </a>
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
        return 'badge-info';
      case 'video':
        return 'badge-secondary';
      case 'audio':
        return 'badge-accent';
      default:
        return 'badge-ghost';
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'images/default.jpg';
  }
}
