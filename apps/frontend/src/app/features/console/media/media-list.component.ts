import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MediaApiService } from '../../../core/services/media-api.service';
import {
  Media,
  MediaStatus,
  MediaType,
} from '../../../shared/models/media.model';

@Component({
  selector: 'app-media-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div>
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold">Mes médias</h1>
          <p class="text-sm text-base-content/60">
            {{ media().length }} média(s) au total
          </p>
        </div>
        <a routerLink="/console/media/upload" class="btn btn-primary btn-sm">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter
        </a>
      </div>

      <!-- Filtres -->
      <div class="flex gap-2 mb-4 flex-wrap">
        @for (f of filters; track f.value) {
          <button
            (click)="activeStatus.set(f.value)"
            class="btn btn-sm"
            [class.btn-primary]="activeStatus() === f.value"
            [class.btn-outline]="activeStatus() !== f.value"
          >
            {{ f.label }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else if (error()) {
        <div role="alert" class="alert alert-error">
          <span>{{ error() }}</span>
        </div>
      } @else if (filteredMedia().length === 0) {
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body items-center text-center py-12">
            <svg
              class="w-12 h-12 opacity-30 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="text-base-content/60 text-sm">Aucun média trouvé.</p>
            <a
              routerLink="/console/media/upload"
              class="link link-primary text-sm mt-2"
            >
              Ajouter votre premier média
            </a>
          </div>
        </div>
      } @else {
        <!-- Desktop table -->
        <div
          class="hidden md:block overflow-x-auto rounded-box border border-base-300 bg-base-100"
        >
          <table class="table">
            <thead>
              <tr>
                <th>Média</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredMedia(); track item._id) {
                <tr class="hover">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar">
                        <div class="w-10 h-10 rounded-lg bg-base-200">
                          @if (item.urls.thumbnail) {
                            <img
                              [src]="item.urls.thumbnail"
                              [alt]="item.title"
                            />
                          } @else {
                            <div
                              class="w-full h-full flex items-center justify-center text-base-content/30"
                            >
                              <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1.5"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                                />
                              </svg>
                            </div>
                          }
                        </div>
                      </div>
                      <span class="font-medium truncate max-w-xs">{{
                        item.title
                      }}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      class="badge badge-sm"
                      [class]="typeBadgeClass(item.mediaType)"
                    >
                      {{ typeLabel(item.mediaType) }}
                    </span>
                  </td>
                  <td>
                    <span
                      class="badge badge-sm"
                      [class]="statusBadgeClass(item.status)"
                    >
                      {{ statusLabel(item.status) }}
                    </span>
                  </td>
                  <td class="text-base-content/60">
                    {{ item.createdAt | date: 'dd/MM/yyyy' }}
                  </td>
                  <td>
                    <div class="flex items-center justify-end gap-1">
                      <a
                        [routerLink]="['/console/media', item._id, 'edit']"
                        class="btn btn-ghost btn-xs"
                      >
                        Modifier
                      </a>
                      @if (item.status === MediaStatus.Draft) {
                        <button
                          (click)="publish(item)"
                          class="btn btn-ghost btn-xs text-success"
                        >
                          Publier
                        </button>
                      } @else if (item.status === MediaStatus.Published) {
                        <button
                          (click)="unpublish(item)"
                          class="btn btn-ghost btn-xs text-warning"
                        >
                          Dépublier
                        </button>
                      }
                      <button
                        (click)="deleteItem(item)"
                        class="btn btn-ghost btn-xs text-error"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Mobile cards -->
        <div class="md:hidden space-y-3">
          @for (item of filteredMedia(); track item._id) {
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-4">
                <div class="flex items-start gap-3 mb-3">
                  <div class="avatar">
                    <div class="w-12 rounded-lg bg-base-200">
                      @if (item.urls.thumbnail) {
                        <img [src]="item.urls.thumbnail" [alt]="item.title" />
                      }
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">
                      {{ item.title }}
                    </p>
                    <div class="flex gap-2 mt-1">
                      <span
                        class="badge badge-sm"
                        [class]="typeBadgeClass(item.mediaType)"
                      >
                        {{ typeLabel(item.mediaType) }}
                      </span>
                      <span
                        class="badge badge-sm"
                        [class]="statusBadgeClass(item.status)"
                      >
                        {{ statusLabel(item.status) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 pt-3 border-t border-base-200">
                  <a
                    [routerLink]="['/console/media', item._id, 'edit']"
                    class="btn btn-ghost btn-xs"
                    >Modifier</a
                  >
                  @if (item.status === MediaStatus.Draft) {
                    <button
                      (click)="publish(item)"
                      class="btn btn-ghost btn-xs text-success"
                    >
                      Publier
                    </button>
                  } @else if (item.status === MediaStatus.Published) {
                    <button
                      (click)="unpublish(item)"
                      class="btn btn-ghost btn-xs text-warning"
                    >
                      Dépublier
                    </button>
                  }
                  <button
                    (click)="deleteItem(item)"
                    class="btn btn-ghost btn-xs text-error"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MediaListComponent implements OnInit {
  private readonly mediaApi = inject(MediaApiService);
  private readonly router = inject(Router);

  readonly MediaStatus = MediaStatus;

  media = signal<Media[]>([]);
  loading = signal(true);
  error = signal('');
  activeStatus = signal<string | null>(null);

  filteredMedia = computed(() => {
    const s = this.activeStatus();
    if (!s) return this.media();
    return this.media().filter((m) => m.status === s);
  });

  readonly filters = [
    { value: null, label: 'Tous' },
    { value: MediaStatus.Draft, label: 'Brouillon' },
    { value: MediaStatus.Published, label: 'Publié' },
    { value: MediaStatus.Archived, label: 'Archivé' },
  ];

  ngOnInit() {
    this.loadMedia();
  }

  loadMedia() {
    this.loading.set(true);
    this.mediaApi.getMyMedia().subscribe({
      next: (data) => {
        this.media.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les médias.');
        this.loading.set(false);
      },
    });
  }

  publish(item: Media) {
    this.mediaApi.publishMedia(item._id!).subscribe({
      next: (updated) => this.updateItem(updated),
    });
  }

  unpublish(item: Media) {
    this.mediaApi.unpublishMedia(item._id!).subscribe({
      next: (updated) => this.updateItem(updated),
    });
  }

  deleteItem(item: Media) {
    if (!confirm(`Supprimer "${item.title}" ?`)) return;
    this.mediaApi.deleteMedia(item._id!).subscribe({
      next: () =>
        this.media.update((list) => list.filter((m) => m._id !== item._id)),
    });
  }

  private updateItem(updated: Media) {
    this.media.update((list) =>
      list.map((m) => (m._id === updated._id ? updated : m)),
    );
  }

  statusLabel(status: MediaStatus): string {
    const labels: Record<string, string> = {
      [MediaStatus.Draft]: 'Brouillon',
      [MediaStatus.Published]: 'Publié',
      [MediaStatus.Archived]: 'Archivé',
    };
    return labels[status] ?? status;
  }

  statusBadgeClass(status: MediaStatus): string {
    const classes: Record<string, string> = {
      [MediaStatus.Draft]: 'badge-ghost',
      [MediaStatus.Published]: 'badge-success',
      [MediaStatus.Archived]: 'badge-warning',
    };
    return classes[status] ?? 'badge-ghost';
  }

  typeLabel(type: MediaType): string {
    const labels: Record<string, string> = {
      [MediaType.Image]: 'Photo',
      [MediaType.Video]: 'Vidéo',
      [MediaType.Audio]: 'Audio',
    };
    return labels[type] ?? type;
  }

  typeBadgeClass(type: MediaType): string {
    const classes: Record<string, string> = {
      [MediaType.Image]: 'badge-info',
      [MediaType.Video]: 'badge-secondary',
      [MediaType.Audio]: 'badge-accent',
    };
    return classes[type] ?? 'badge-ghost';
  }
}
