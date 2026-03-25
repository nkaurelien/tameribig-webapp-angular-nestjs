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
          <h1 class="text-xl font-bold text-gray-900">Mes médias</h1>
          <p class="text-sm text-gray-500 mt-1">
            {{ media().length }} média(s) au total
          </p>
        </div>
        <a
          routerLink="/console/media/upload"
          class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg no-underline transition-colors flex items-center gap-2"
        >
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
            [class]="
              activeStatus() === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            "
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            {{ f.label }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div
            class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
          ></div>
        </div>
      } @else if (error()) {
        <div
          class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg"
        >
          {{ error() }}
        </div>
      } @else if (filteredMedia().length === 0) {
        <div
          class="bg-white border border-gray-200 rounded-xl p-12 text-center"
        >
          <svg
            class="w-12 h-12 text-gray-300 mx-auto mb-3"
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
          <p class="text-gray-500 text-sm">Aucun média trouvé.</p>
          <a
            routerLink="/console/media/upload"
            class="text-indigo-600 text-sm font-medium hover:text-indigo-800 no-underline mt-2 inline-block"
          >
            Ajouter votre premier média
          </a>
        </div>
      } @else {
        <!-- Desktop table -->
        <div
          class="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 font-medium text-gray-600">
                  Média
                </th>
                <th class="text-left px-4 py-3 font-medium text-gray-600">
                  Type
                </th>
                <th class="text-left px-4 py-3 font-medium text-gray-600">
                  Statut
                </th>
                <th class="text-left px-4 py-3 font-medium text-gray-600">
                  Date
                </th>
                <th class="text-right px-4 py-3 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (item of filteredMedia(); track item._id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0"
                      >
                        @if (item.urls.thumbnail) {
                          <img
                            [src]="item.urls.thumbnail"
                            [alt]="item.title"
                            class="w-full h-full object-cover"
                          />
                        } @else {
                          <div
                            class="w-full h-full flex items-center justify-center text-gray-400"
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
                      <span
                        class="font-medium text-gray-900 truncate max-w-xs"
                        >{{ item.title }}</span
                      >
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      [class]="typeBadgeClass(item.mediaType)"
                      class="px-2 py-0.5 rounded text-xs font-medium"
                    >
                      {{ typeLabel(item.mediaType) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span
                      [class]="statusBadgeClass(item.status)"
                      class="px-2 py-0.5 rounded text-xs font-medium"
                    >
                      {{ statusLabel(item.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-500">
                    {{ item.createdAt | date: 'dd/MM/yyyy' }}
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end gap-2">
                      <a
                        [routerLink]="['/console/media', item._id, 'edit']"
                        class="text-xs text-indigo-600 hover:text-indigo-800 font-medium no-underline"
                      >
                        Modifier
                      </a>
                      @if (item.status === MediaStatus.Draft) {
                        <button
                          (click)="publish(item)"
                          class="text-xs text-green-600 hover:text-green-800 font-medium"
                        >
                          Publier
                        </button>
                      } @else if (item.status === MediaStatus.Published) {
                        <button
                          (click)="unpublish(item)"
                          class="text-xs text-orange-600 hover:text-orange-800 font-medium"
                        >
                          Dépublier
                        </button>
                      }
                      <button
                        (click)="delete(item)"
                        class="text-xs text-red-500 hover:text-red-700 font-medium"
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
            <div class="bg-white border border-gray-200 rounded-xl p-4">
              <div class="flex items-start gap-3 mb-3">
                <div
                  class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0"
                >
                  @if (item.urls.thumbnail) {
                    <img
                      [src]="item.urls.thumbnail"
                      [alt]="item.title"
                      class="w-full h-full object-cover"
                    />
                  }
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 text-sm truncate">
                    {{ item.title }}
                  </p>
                  <div class="flex gap-2 mt-1">
                    <span
                      [class]="typeBadgeClass(item.mediaType)"
                      class="px-2 py-0.5 rounded text-xs font-medium"
                    >
                      {{ typeLabel(item.mediaType) }}
                    </span>
                    <span
                      [class]="statusBadgeClass(item.status)"
                      class="px-2 py-0.5 rounded text-xs font-medium"
                    >
                      {{ statusLabel(item.status) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex gap-3 pt-3 border-t border-gray-100">
                <a
                  [routerLink]="['/console/media', item._id, 'edit']"
                  class="text-xs text-indigo-600 font-medium no-underline"
                  >Modifier</a
                >
                @if (item.status === MediaStatus.Draft) {
                  <button
                    (click)="publish(item)"
                    class="text-xs text-green-600 font-medium"
                  >
                    Publier
                  </button>
                } @else if (item.status === MediaStatus.Published) {
                  <button
                    (click)="unpublish(item)"
                    class="text-xs text-orange-600 font-medium"
                  >
                    Dépublier
                  </button>
                }
                <button
                  (click)="delete(item)"
                  class="text-xs text-red-500 font-medium"
                >
                  Supprimer
                </button>
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

  delete(item: Media) {
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
      [MediaStatus.Draft]: 'bg-gray-100 text-gray-600',
      [MediaStatus.Published]: 'bg-green-100 text-green-700',
      [MediaStatus.Archived]: 'bg-yellow-100 text-yellow-700',
    };
    return classes[status] ?? 'bg-gray-100 text-gray-600';
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
      [MediaType.Image]: 'bg-blue-100 text-blue-700',
      [MediaType.Video]: 'bg-purple-100 text-purple-700',
      [MediaType.Audio]: 'bg-orange-100 text-orange-700',
    };
    return classes[type] ?? 'bg-gray-100 text-gray-600';
  }
}
