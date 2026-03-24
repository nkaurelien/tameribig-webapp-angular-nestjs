import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { PublicMedia, MediaType } from '../../shared/models/media.model';
import { MediaCardComponent } from '../../shared/components/media-card/media-card.component';
import { MOCK_MEDIA } from '../../shared/data/mock-media';

interface FilterTab {
  label: string;
  value: string | null;
  icon: string;
}

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, MediaCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Explorer</h1>
          <p class="text-gray-500 mt-1">
            {{ filteredMedia().length }} résultat{{
              filteredMedia().length > 1 ? 's' : ''
            }}
          </p>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
        @for (tab of filterTabs; track tab.value) {
          <button
            (click)="setFilter(tab.value)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            [class]="
              activeFilter() === tab.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            "
          >
            <img
              *ngIf="tab.icon"
              [src]="tab.icon"
              [alt]="tab.label"
              class="h-5 w-auto"
            />
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Grid -->
      @if (loading()) {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (i of skeletons; track i) {
            <div
              class="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse"
            >
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          }
        </div>
      } @else if (filteredMedia().length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (item of displayedMedia(); track item._id) {
            <app-media-card [media]="item" />
          }
        </div>

        <!-- Load more -->
        @if (displayedMedia().length < filteredMedia().length) {
          <div class="text-center mt-8">
            <button
              (click)="loadMore()"
              class="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium px-8 py-3 rounded-full shadow-sm hover:shadow transition-all"
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Charger plus
            </button>
          </div>
        }
      } @else {
        <!-- No content -->
        <div class="flex flex-col items-center justify-center py-20">
          <img
            src="images/masque-afrique.jpg"
            alt="Aucun contenu"
            class="w-40 h-auto object-contain opacity-70 mb-6"
          />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Aucun média trouvé
          </h2>
          <p class="text-gray-500 text-center max-w-md mb-6">
            @if (activeFilter()) {
              Aucun média de type "{{ activeFilterLabel() }}" pour le moment.
            } @else {
              Il n'y a pas encore de médias publiés.
            }
          </p>
          @if (activeFilter()) {
            <button
              (click)="setFilter(null)"
              class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
            >
              Réinitialiser les filtres
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class ExplorerComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  allMedia = signal<PublicMedia[]>([]);
  activeFilter = signal<string | null>(null);
  loading = signal(true);
  displayLimit = signal(12);

  skeletons = Array.from({ length: 12 }, (_, i) => i);

  filterTabs: FilterTab[] = [
    { label: 'Tous', value: null, icon: '' },
    { label: 'Photos', value: 'image', icon: 'images/camera.png' },
    { label: 'Vidéos', value: 'video', icon: 'images/video.png' },
    { label: 'Audio', value: 'audio', icon: 'images/audio.png' },
    {
      label: 'Illustrations',
      value: 'illustration',
      icon: 'images/illustration.png',
    },
  ];

  filteredMedia = computed(() => {
    const filter = this.activeFilter();
    const all = this.allMedia();
    if (!filter) return all;
    return all.filter((m) => m.mediaType === filter);
  });

  displayedMedia = computed(() => {
    return this.filteredMedia().slice(0, this.displayLimit());
  });

  activeFilterLabel = computed(() => {
    const tab = this.filterTabs.find((t) => t.value === this.activeFilter());
    return tab?.label || '';
  });

  ngOnInit() {
    // Read ?type= from URL
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.activeFilter.set(params['type']);
      }
    });

    this.loadData();
  }

  setFilter(type: string | null) {
    this.activeFilter.set(type);
    this.displayLimit.set(12);
    this.router.navigate([], {
      queryParams: type ? { type } : {},
      queryParamsHandling: type ? 'merge' : '',
    });
  }

  loadMore() {
    this.displayLimit.update((v) => v + 12);
  }

  private loadData() {
    this.api.get<PublicMedia[]>('/media?limit=100').subscribe({
      next: (data) => {
        this.allMedia.set(data.length > 0 ? data : MOCK_MEDIA);
        this.loading.set(false);
      },
      error: () => {
        // Fallback to mock data when backend is unavailable
        this.allMedia.set(MOCK_MEDIA);
        this.loading.set(false);
      },
    });
  }
}
