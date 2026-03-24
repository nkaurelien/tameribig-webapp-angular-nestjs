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

      <!-- Header with gradient -->
      @if (topic(); as t) {
        <div
          class="rounded-2xl p-8 sm:p-12 mb-10"
          [style.background]="gradient"
        >
          <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
            {{ t.name }}
          </h1>
          @if (t.description) {
            <p class="text-white/80 text-lg max-w-2xl">{{ t.description }}</p>
          }
          <p class="text-white/60 text-sm mt-4">
            {{ media().length }} média{{ media().length > 1 ? 's' : '' }}
          </p>
        </div>
      }

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
      } @else if (media().length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (item of media(); track item._id) {
            <app-media-card [media]="item" />
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20">
          <svg
            class="w-16 h-16 text-gray-300 mb-4"
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
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Aucun média</h2>
          <p class="text-gray-500 mb-6">
            Cette catégorie ne contient pas encore de médias.
          </p>
          <a
            routerLink="/explorer"
            class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-full no-underline transition-colors"
          >
            Explorer tout
          </a>
        </div>
      }
    </div>
  `,
})
export class TopicDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  topic = signal<Topic | null>(null);
  media = signal<PublicMedia[]>([]);
  loading = signal(true);

  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  private readonly gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  ];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      this.loadTopic(slug);
      this.loadMedia(slug);
    });
  }

  private loadTopic(slug: string) {
    this.api.get<Topic[]>('/topics').subscribe({
      next: (topics) => {
        const all = topics.length > 0 ? topics : MOCK_TOPICS;
        const found = all.find((t) => t.slug === slug);
        this.topic.set(found || null);
        if (found) {
          const idx = all.indexOf(found);
          this.gradient = this.gradients[idx % this.gradients.length];
        }
      },
      error: () => {
        const found = MOCK_TOPICS.find((t) => t.slug === slug);
        this.topic.set(found || null);
      },
    });
  }

  private loadMedia(slug: string) {
    this.api.get<PublicMedia[]>(`/media/topic/${slug}?limit=50`).subscribe({
      next: (data) => {
        this.media.set(data.length > 0 ? data : this.mockMediaForTopic(slug));
        this.loading.set(false);
      },
      error: () => {
        this.media.set(this.mockMediaForTopic(slug));
        this.loading.set(false);
      },
    });
  }

  private mockMediaForTopic(slug: string): PublicMedia[] {
    // Return a subset of mock media as demo content
    return MOCK_MEDIA.slice(0, 8).map((m) => ({
      ...m,
      _id: `${m._id}-${slug}`,
      topics: [slug],
    }));
  }
}
