import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Topic } from '../../shared/models/topic.model';
import { PublicMedia } from '../../shared/models/media.model';
import { MediaCardComponent } from '../../shared/components/media-card/media-card.component';
import { MOCK_TOPICS } from '../../shared/data/mock-topics';
import { MOCK_MEDIA } from '../../shared/data/mock-media';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MediaCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a
          routerLink="/topics"
          class="hover:text-indigo-600 no-underline transition-colors"
          >Catégories</a
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
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span class="text-gray-900 font-medium">{{ topic()?.name }}</span>
      </nav>

      <!-- Header -->
      @if (topic(); as t) {
        <div class="mb-8">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 uppercase">
            {{ t.name }}
          </h1>
          @if (t.description) {
            <p class="text-gray-500 text-lg mt-2">{{ t.description }}</p>
          }
        </div>
      }

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
            @if (tab.icon) {
              <img [src]="tab.icon" [alt]="tab.label" class="h-5 w-auto" />
            }
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- Results count -->
      <p class="text-sm text-gray-400 mb-4">
        {{ filteredMedia().length }} résultat{{
          filteredMedia().length > 1 ? 's' : ''
        }}
      </p>

      <!-- Media grid -->
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
      } @else if (filteredMedia().length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (item of filteredMedia(); track item._id) {
            <app-media-card [media]="item" />
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20">
          <img
            src="images/masque-afrique.jpg"
            alt=""
            class="w-40 h-auto object-contain opacity-70 mb-6"
          />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Aucun média</h2>
          <p class="text-gray-500 mb-6">
            @if (activeFilter()) {
              Aucun média de ce type dans cette catégorie.
            } @else {
              Cette catégorie ne contient pas encore de médias.
            }
          </p>
          @if (activeFilter()) {
            <button
              (click)="setFilter(null)"
              class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
            >
              Voir tout
            </button>
          } @else {
            <a
              routerLink="/explorer"
              class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-full no-underline transition-colors"
            >
              Explorer tout
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class TopicDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  topic = signal<Topic | null>(null);
  allMedia = signal<PublicMedia[]>([]);
  activeFilter = signal<string | null>(null);
  loading = signal(true);

  filterTabs = [
    { label: 'Tous', value: null, icon: '' },
    { label: 'Photos', value: 'image', icon: 'images/camera.png' },
    { label: 'Vidéos', value: 'video', icon: 'images/video.png' },
    { label: 'Audio', value: 'audio', icon: 'images/audio.png' },
    { label: 'Créas', value: 'illustration', icon: 'images/illustration.png' },
  ];

  filteredMedia = computed(() => {
    const filter = this.activeFilter();
    const all = this.allMedia();
    if (!filter) return all;
    return all.filter((m) => m.mediaType === filter);
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      this.loadTopic(slug);
      this.loadMedia(slug);
    });
  }

  setFilter(type: string | null) {
    this.activeFilter.set(type);
  }

  private loadTopic(slug: string) {
    this.api.get<Topic[]>('/topics').subscribe({
      next: (topics) => {
        const all = topics.length > 0 ? topics : MOCK_TOPICS;
        this.topic.set(all.find((t) => t.slug === slug) || null);
      },
      error: () => {
        this.topic.set(MOCK_TOPICS.find((t) => t.slug === slug) || null);
      },
    });
  }

  private loadMedia(slug: string) {
    this.api.get<PublicMedia[]>(`/media/topic/${slug}?limit=50`).subscribe({
      next: (data) => {
        this.allMedia.set(
          data.length > 0 ? data : this.mockMediaForTopic(slug),
        );
        this.loading.set(false);
      },
      error: () => {
        this.allMedia.set(this.mockMediaForTopic(slug));
        this.loading.set(false);
      },
    });
  }

  private mockMediaForTopic(slug: string): PublicMedia[] {
    return MOCK_MEDIA.slice(0, 8).map((m) => ({
      ...m,
      _id: `${m._id}-${slug}`,
      topics: [slug],
    }));
  }
}
