import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PublicMedia } from '../../shared/models/media.model';
import { Topic } from '../../shared/models/topic.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  styles: [
    `
      .diamond {
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      }
    `,
  ],
  template: `
    <!-- Section 1: Search (Google-style) -->
    <section
      class="flex flex-col items-center justify-center px-4 pt-16 pb-12"
      style="min-height: 50vh"
    >
      <div
        class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-6"
      >
        <span class="text-white font-bold text-lg">T</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        Tameri
      </h1>
      <p class="text-gray-500 text-lg mb-10">Explorez des créations uniques</p>

      <!-- Search bar -->
      <div class="w-full max-w-xl">
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
            class="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow transition-shadow"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-3 mt-6">
          <button
            (click)="onSearch()"
            class="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Explorer
          </button>
          <button
            routerLink="/explorer"
            class="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            J'ai de la chance
          </button>
        </div>

        <!-- Category chips -->
        @if (topics().length > 0) {
          <div class="flex flex-wrap justify-center gap-2 mt-8">
            @for (topic of topics().slice(0, 8); track topic._id) {
              <a
                [routerLink]="['/topics', topic.slug]"
                class="text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 rounded-full px-4 py-1.5 text-xs font-medium no-underline transition-colors"
              >
                {{ topic.name }}
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- Section 2: Diamond mosaic -->
    <section class="w-full overflow-hidden bg-gray-50 py-4">
      <div
        class="grid gap-1 justify-center px-1"
        [style.gridTemplateColumns]="
          'repeat(auto-fill, minmax(' + diamondSize + 'px, 1fr))'
        "
      >
        @for (item of mosaicItems(); track $index) {
          <div
            class="diamond relative cursor-pointer transition-transform hover:scale-105 hover:z-10"
            [style.aspectRatio]="'1'"
            [style.background]="item.color"
          >
            @if (item.thumbnail) {
              <img
                [src]="item.thumbnail"
                [alt]="item.title"
                loading="lazy"
                class="absolute inset-0 w-[142%] h-[142%] object-cover"
                style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
              />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  searchQuery = '';
  topics = signal<Topic[]>([]);
  media = signal<PublicMedia[]>([]);
  mosaicItems = signal<
    { thumbnail: string | null; title: string; color: string }[]
  >([]);

  readonly diamondSize = window.innerWidth < 768 ? 100 : 160;

  private readonly colors = [
    '#e0e7ff',
    '#dbeafe',
    '#ede9fe',
    '#fce7f3',
    '#fef3c7',
    '#d1fae5',
    '#cffafe',
    '#e0f2fe',
    '#f3e8ff',
    '#fce4ec',
    '#fff7ed',
    '#ecfdf5',
    '#eff6ff',
    '#faf5ff',
    '#fdf2f8',
    '#f0fdf4',
    '#f0f9ff',
    '#fefce8',
    '#f5f3ff',
    '#fff1f2',
  ];

  ngOnInit() {
    this.loadData();
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery },
      });
    } else {
      this.router.navigate(['/explorer']);
    }
  }

  private loadData() {
    this.api.get<Topic[]>('/topics').subscribe({
      next: (data) => this.topics.set(data),
      error: () => {},
    });

    this.api.get<PublicMedia[]>('/media?limit=40').subscribe({
      next: (data) => {
        this.media.set(data);
        this.buildMosaic(data);
      },
      error: () => this.buildMosaic([]),
    });
  }

  private buildMosaic(items: PublicMedia[]) {
    const total = 40;
    const mosaic = [];
    for (let i = 0; i < total; i++) {
      if (i < items.length && items[i].urls.thumbnail) {
        mosaic.push({
          thumbnail: items[i].urls.thumbnail!,
          title: items[i].title,
          color: this.colors[i % this.colors.length],
        });
      } else {
        mosaic.push({
          thumbnail: null,
          title: '',
          color: this.colors[i % this.colors.length],
        });
      }
    }
    this.mosaicItems.set(mosaic);
  }
}
