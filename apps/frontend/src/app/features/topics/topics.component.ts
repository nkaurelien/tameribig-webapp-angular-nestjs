import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Topic } from '../../shared/models/topic.model';
import { MOCK_TOPICS } from '../../shared/data/mock-topics';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900">Catégories</h1>
        <p class="text-gray-500 mt-1">Parcourez les créations par thématique</p>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div
              class="animate-pulse rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <div class="h-40 bg-gray-200"></div>
              <div class="p-5">
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          }
        </div>
      } @else if (topics().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (topic of topics(); track topic._id) {
            <a
              [routerLink]="['/topics', topic.slug]"
              class="group block bg-white border border-gray-200 rounded-xl overflow-hidden no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <!-- Cover -->
              <div
                class="h-40 overflow-hidden"
                [style.background]="gradients[$index % gradients.length]"
              >
                @if (topic.miniature) {
                  <img
                    [src]="topic.miniature"
                    [alt]="topic.name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <svg
                      class="w-12 h-12 text-white/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                }
              </div>

              <!-- Info -->
              <div class="p-5">
                <h2
                  class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors"
                >
                  {{ topic.name }}
                </h2>
                @if (topic.description) {
                  <p class="text-sm text-gray-500 mt-2 line-clamp-2">
                    {{ topic.description }}
                  </p>
                }
              </div>
            </a>
          }
        </div>
      } @else {
        <!-- Empty -->
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Aucune catégorie
          </h2>
          <p class="text-gray-500">
            Les catégories seront bientôt disponibles.
          </p>
        </div>
      }
    </div>
  `,
})
export class TopicsComponent implements OnInit {
  private readonly api = inject(ApiService);

  topics = signal<Topic[]>([]);
  loading = signal(true);

  gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  ];

  ngOnInit() {
    this.api.get<Topic[]>('/topics').subscribe({
      next: (data) => {
        this.topics.set(data.length > 0 ? data : MOCK_TOPICS);
        this.loading.set(false);
      },
      error: () => {
        this.topics.set(MOCK_TOPICS);
        this.loading.set(false);
      },
    });
  }
}
