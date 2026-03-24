import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { PublicMedia } from '../../shared/models/media.model';
import { MediaCardComponent } from '../../shared/components/media-card/media-card.component';
import { MOCK_MEDIA } from '../../shared/data/mock-media';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search bar -->
      <div class="max-w-2xl mx-auto mb-10">
        <div class="relative">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keydown.enter)="onSearch()"
            placeholder="Rechercher des images, vidéos, audio..."
            class="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          />
          @if (searchQuery) {
            <button
              (click)="clearSearch()"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          }
        </div>
      </div>

      <!-- Media type filters (under search bar) -->
      <div class="mb-8">
        <div class="flex justify-center gap-6 sm:gap-10">
          <button
            (click)="setFilter(null)"
            class="flex flex-col items-center gap-2 group"
          >
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all"
              [class]="
                activeFilter() === null
                  ? 'bg-indigo-100 ring-2 ring-indigo-500'
                  : 'bg-gray-100 group-hover:bg-gray-200'
              "
            >
              <svg
                class="w-6 h-6"
                [class]="
                  activeFilter() === null ? 'text-indigo-600' : 'text-gray-500'
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </div>
            <span
              class="text-xs font-medium"
              [class]="
                activeFilter() === null ? 'text-indigo-600' : 'text-gray-500'
              "
              >Tous</span
            >
          </button>
          <button
            (click)="setFilter('image')"
            class="flex flex-col items-center gap-2 group"
          >
            <img
              src="images/camera.png"
              alt="Photos"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
              [class.ring-2]="activeFilter() === 'image'"
              [class.ring-orange-400]="activeFilter() === 'image'"
              [class.rounded-full]="activeFilter() === 'image'"
            />
            <span
              class="text-xs font-medium"
              [class]="
                activeFilter() === 'image' ? 'text-orange-600' : 'text-gray-500'
              "
              >Images</span
            >
          </button>
          <button
            (click)="setFilter('video')"
            class="flex flex-col items-center gap-2 group"
          >
            <img
              src="images/video.png"
              alt="Vidéos"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
              [class.ring-2]="activeFilter() === 'video'"
              [class.ring-purple-400]="activeFilter() === 'video'"
              [class.rounded-full]="activeFilter() === 'video'"
            />
            <span
              class="text-xs font-medium"
              [class]="
                activeFilter() === 'video' ? 'text-purple-600' : 'text-gray-500'
              "
              >Vidéos</span
            >
          </button>
          <button
            (click)="setFilter('audio')"
            class="flex flex-col items-center gap-2 group"
          >
            <img
              src="images/audio.png"
              alt="Audio"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
              [class.ring-2]="activeFilter() === 'audio'"
              [class.ring-blue-400]="activeFilter() === 'audio'"
              [class.rounded-full]="activeFilter() === 'audio'"
            />
            <span
              class="text-xs font-medium"
              [class]="
                activeFilter() === 'audio' ? 'text-blue-600' : 'text-gray-500'
              "
              >Audios</span
            >
          </button>
          <button
            (click)="setFilter('illustration')"
            class="flex flex-col items-center gap-2 group"
          >
            <img
              src="images/illustration.png"
              alt="Créas"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
              [class.ring-2]="activeFilter() === 'illustration'"
              [class.ring-green-400]="activeFilter() === 'illustration'"
              [class.rounded-full]="activeFilter() === 'illustration'"
            />
            <span
              class="text-xs font-medium"
              [class]="
                activeFilter() === 'illustration'
                  ? 'text-green-600'
                  : 'text-gray-500'
              "
              >Créas</span
            >
          </button>
        </div>
      </div>

      <!-- Results header -->
      @if (searchQuery) {
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            Résultats pour "<span class="text-indigo-600">{{
              searchQuery
            }}</span
            >"
          </h1>
          <p class="text-gray-500 mt-1">
            {{ filteredResults().length }} résultat{{
              filteredResults().length > 1 ? 's' : ''
            }}
          </p>
        </div>
      } @else {
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Recherche</h1>
          <p class="text-gray-500 mt-1">
            Explorez tous les médias de la communauté
          </p>
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) {
            <div
              class="animate-pulse rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-3">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          }
        </div>
      } @else if (filteredResults().length > 0) {
        <!-- Results grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (item of filteredResults(); track item._id) {
            <app-media-card [media]="item" />
          }
        </div>
      } @else {
        <!-- No results -->
        <div class="flex flex-col items-center justify-center py-20">
          <img
            src="images/masque-afrique.jpg"
            alt=""
            class="w-40 h-auto object-contain opacity-70 mb-6"
          />
          @if (searchQuery) {
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat
            </h2>
            <p class="text-gray-500 text-center max-w-md mb-6">
              Votre recherche "<strong>{{ searchQuery }}</strong
              >" n'a rien donné. Essayez d'autres mots-clés.
            </p>
            <button
              (click)="clearSearch()"
              class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
            >
              Effacer la recherche
            </button>
          } @else {
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              Commencez votre recherche
            </h2>
            <p class="text-gray-500">
              Tapez un mot-clé pour trouver des médias.
            </p>
          }
        </div>
      }
    </div>
  `,
})
export class SearchComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  searchQuery = '';
  allMedia = signal<PublicMedia[]>([]);
  activeFilter = signal<string | null>(null);
  loading = signal(true);

  filteredResults = computed(() => {
    let results = this.allMedia();
    const q = this.searchQuery.toLowerCase().trim();
    const filter = this.activeFilter();

    // Text filter
    if (q) {
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description || '').toLowerCase().includes(q) ||
          m.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    // Type filter
    if (filter) {
      results = results.filter((m) => m.mediaType === filter);
    }

    return results;
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.searchQuery = params['q'];
      }
      if (params['type']) {
        this.activeFilter.set(params['type']);
      }
    });

    this.loadData();
  }

  onSearch() {
    this.router.navigate([], {
      queryParams: { q: this.searchQuery || null, type: this.activeFilter() },
      queryParamsHandling: 'merge',
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.activeFilter.set(null);
    this.router.navigate(['/search']);
  }

  setFilter(type: string | null) {
    this.activeFilter.set(type);
  }

  private loadData() {
    this.api.get<PublicMedia[]>('/media?limit=100').subscribe({
      next: (data) => {
        this.allMedia.set(data.length > 0 ? data : MOCK_MEDIA);
        this.loading.set(false);
      },
      error: () => {
        this.allMedia.set(MOCK_MEDIA);
        this.loading.set(false);
      },
    });
  }
}
